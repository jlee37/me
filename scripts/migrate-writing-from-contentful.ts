/**
 * One-time migration script: Contentful writing → Neon
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - CONTENTFUL_* vars set in .env.local
 *   - CLOUDINARY_* vars set in .env.local (for hero image upload)
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/migrate-writing-from-contentful.ts
 *
 * Idempotent: entries whose slug already exists in Neon are skipped.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "contentful";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/schema";
import { uploadToCloudinary } from "../lib/cloudinary";

const contentful = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function prefixUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function downloadAndUploadHero(
  contentfulUrl: string,
  slug: string
): Promise<string> {
  const url = prefixUrl(contentfulUrl);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = url.split("?")[0].split(".").pop() ?? "jpg";
  const filename = sanitizeFilename(`writing-${slug}-hero-${Date.now()}.${ext}`);

  const { url: uploadedUrl } = await uploadToCloudinary(buffer, filename);
  return uploadedUrl;
}

async function main() {
  console.log("Fetching all writing entries from Contentful...");

  const response = await contentful.getEntries({
    content_type: "writing",
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
      heroUrl?: string;
      content?: string;
    };

    const { title, slug, date, heroUrl, content } = fields;

    if (!slug || !title || !date || !content) {
      console.warn(`  ⚠ Skipping entry with missing fields:`, { title, slug });
      skipped++;
      continue;
    }

    const [existing] = await db
      .select({ id: schema.writingEntries.id })
      .from(schema.writingEntries)
      .where(eq(schema.writingEntries.slug, slug));

    if (existing) {
      console.log(`  → Skipping "${title}" (${slug}) — already in Neon`);
      skipped++;
      continue;
    }

    console.log(`  Migrating "${title}" (${slug})...`);

    try {
      let uploadedHeroUrl: string | null = null;
      if (heroUrl) {
        console.log(`    Uploading hero image...`);
        uploadedHeroUrl = await downloadAndUploadHero(heroUrl, slug);
      }

      await db.insert(schema.writingEntries).values({
        title,
        slug,
        date,
        heroUrl: uploadedHeroUrl,
        content,
      });

      console.log(`  ✓ "${title}" migrated`);
      migrated++;

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
