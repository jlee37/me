/**
 * One-time script: re-upload Vercel Blob images → Cloudinary and update Neon URLs.
 *
 * Run:
 *   npx tsx scripts/remigrate-blob-to-cloudinary.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/schema";
import { uploadToCloudinary } from "../lib/cloudinary";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function isBlobUrl(url: string): boolean {
  return url.includes(".public.blob.vercel-storage.com");
}

async function main() {
  const entries = await db.select().from(schema.photojournalEntries);
  console.log(`Found ${entries.length} entries in Neon.\n`);

  let updatedBlocks = 0;
  let updatedPreviews = 0;

  for (const entry of entries) {
    console.log(`Processing "${entry.title}" (${entry.slug})...`);

    // Re-upload preview photo if it's a Blob URL
    if (entry.previewPhotoUrl && isBlobUrl(entry.previewPhotoUrl)) {
      const filename = sanitizeFilename(`${entry.slug}-preview-${Date.now()}`);
      const buffer = await downloadBuffer(entry.previewPhotoUrl);
      const { url } = await uploadToCloudinary(buffer, filename);
      await db
        .update(schema.photojournalEntries)
        .set({ previewPhotoUrl: url })
        .where(eq(schema.photojournalEntries.id, entry.id));
      updatedPreviews++;
      console.log(`  ✓ Preview photo re-uploaded`);
    }

    // Re-upload each photo block with a Blob URL
    const blocks = await db
      .select()
      .from(schema.photojournalBlocks)
      .where(eq(schema.photojournalBlocks.entryId, entry.id));

    const photoBlocks = blocks.filter(
      (b) => b.type === "photo" && isBlobUrl((b.content as { url: string }).url)
    );

    if (photoBlocks.length > 0) {
      console.log(`  Re-uploading ${photoBlocks.length} photo blocks...`);
    }

    for (let i = 0; i < photoBlocks.length; i++) {
      const block = photoBlocks[i];
      const content = block.content as { url: string; caption: string; width: number; height: number };
      const filename = sanitizeFilename(`${entry.slug}-${String(block.position + 1).padStart(3, "0")}-${Date.now()}`);

      const buffer = await downloadBuffer(content.url);
      const { url, width, height } = await uploadToCloudinary(buffer, filename);

      await db
        .update(schema.photojournalBlocks)
        .set({ content: { ...content, url, width, height } })
        .where(eq(schema.photojournalBlocks.id, block.id));

      updatedBlocks++;
      process.stdout.write(`\r  ${i + 1}/${photoBlocks.length} blocks re-uploaded`);
    }

    if (photoBlocks.length > 0) console.log();
  }

  console.log(`
Re-migration complete:
  Preview photos updated: ${updatedPreviews}
  Photo blocks updated:   ${updatedBlocks}
`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
