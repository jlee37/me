/**
 * One-time migration script: Contentful memories → Neon + Vercel Blob
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - BLOB_READ_WRITE_TOKEN set in .env.local
 *   - CONTENTFUL_* vars set in .env.local
 *
 * Run:
 *   npx ts-node --env-file=.env.local scripts/migrate-from-contentful.ts
 *
 * The script is idempotent: entries whose slug already exists in Neon are skipped.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "contentful";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { Asset } from "contentful";
import * as schema from "../lib/schema";
import { uploadToCloudinary } from "../lib/cloudinary";

// ── Clients ──────────────────────────────────────────────────────────────────

const contentful = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// ── Helpers ───────────────────────────────────────────────────────────────────

function prefixUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

async function downloadAndUpload(
  contentfulUrl: string,
  filename: string
): Promise<{ url: string; width: number; height: number }> {
  const url = prefixUrl(contentfulUrl);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return uploadToCloudinary(buffer, filename);
}

function getDimensions(asset: Asset): { width: number; height: number } {
  const details = asset.fields?.file?.details as
    | { image?: { width: number; height: number } }
    | undefined;
  return {
    width: details?.image?.width ?? 0,
    height: details?.image?.height ?? 0,
  };
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching all memory entries from Contentful...");

  const response = await contentful.getEntries({
    content_type: "memory",
    include: 2,
    limit: 1000,
  });

  const entries = response.items;
  console.log(`Found ${entries.length} entries.\n`);

  let skipped = 0;
  let migrated = 0;
  let failed = 0;

  for (const item of entries) {
    const fields = item.fields as {
      title?: string;
      slug?: string;
      date?: string;
      opener?: string;
      location?: { lat: number; lon: number };
      photos?: Asset[];
      previewPhoto?: Asset;
    };

    const { title, slug, date, opener, location, photos, previewPhoto } =
      fields;

    if (!slug || !title || !date) {
      console.warn(`  ⚠ Skipping entry with missing slug/title/date:`, { title, slug });
      skipped++;
      continue;
    }

    // Idempotency check
    const [existing] = await db
      .select({ id: schema.photojournalEntries.id })
      .from(schema.photojournalEntries)
      .where(eq(schema.photojournalEntries.slug, slug));

    if (existing) {
      console.log(`  → Skipping "${title}" (${slug}) — already in Neon`);
      skipped++;
      continue;
    }

    console.log(`  Migrating "${title}" (${slug})...`);

    try {
      // 1. Upload preview photo
      let previewPhotoUrl: string | null = null;
      const previewAsset = previewPhoto ?? photos?.[0];
      if (previewAsset?.fields?.file?.url) {
        const previewUrl = previewAsset.fields.file.url as string;
        const previewFilename = sanitizeFilename(
          `${slug}-preview-${Date.now()}.${previewUrl.split("?")[0].split(".").pop() ?? "jpg"}`
        );
        console.log(`    Uploading preview photo...`);
        const { url } = await downloadAndUpload(previewUrl, previewFilename);
        previewPhotoUrl = url;
      }

      // 2. Insert entry row
      const [entry] = await db
        .insert(schema.photojournalEntries)
        .values({
          title,
          slug,
          date,
          opener: opener ?? null,
          locationLat: location?.lat ?? null,
          locationLon: location?.lon ?? null,
          previewPhotoUrl,
        })
        .returning();

      // 3. Upload each photo and insert blocks
      const photoAssets = (photos ?? []).filter(
        (p): p is Asset => !!p?.fields?.file?.url
      );

      console.log(`    Uploading ${photoAssets.length} photos...`);

      const blockValues = [];
      for (let i = 0; i < photoAssets.length; i++) {
        const asset = photoAssets[i];
        const rawUrl = asset.fields.file!.url as string;
        const ext = rawUrl.split("?")[0].split(".").pop() ?? "jpg";
        const filename = sanitizeFilename(
          `${slug}-${String(i + 1).padStart(3, "0")}-${Date.now()}.${ext}`
        );

        const { url: uploadedUrl, width, height } = await downloadAndUpload(rawUrl, filename);
        // Use Cloudinary dimensions if available, fall back to Contentful metadata
        const contentfulDims = getDimensions(asset);
        const caption = (asset.fields.description as string | undefined) ?? "";

        blockValues.push({
          entryId: entry.id,
          position: i,
          type: "photo" as const,
          content: {
            url: uploadedUrl,
            caption,
            width: width || contentfulDims.width,
            height: height || contentfulDims.height,
          },
        });

        process.stdout.write(`\r    ${i + 1}/${photoAssets.length} photos uploaded`);
      }

      if (blockValues.length > 0) {
        await db.insert(schema.photojournalBlocks).values(blockValues);
      }

      console.log(`\n  ✓ "${title}" migrated (${blockValues.length} photos)`);
      migrated++;

      // Brief pause to avoid hammering Contentful CDN
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✗ Failed to migrate "${title}":`, err);
      failed++;
    }
  }

  console.log(`
Migration complete:
  Migrated: ${migrated}
  Skipped:  ${skipped}
  Failed:   ${failed}
`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
