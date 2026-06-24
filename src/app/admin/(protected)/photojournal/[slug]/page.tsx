import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import db from "../../../../../../lib/db";
import { photojournalEntries, photojournalBlocks } from "../../../../../../lib/schema";
import MemoryEntryForm, {
  blocksToEditorBlocks,
} from "@/components/MemoryEntryForm";

type EditPageProps = { params: Promise<{ slug: string }> };

export default async function EditMemoryPage({ params }: EditPageProps) {
  const { slug } = await params;

  const [entry] = await db
    .select()
    .from(photojournalEntries)
    .where(eq(photojournalEntries.slug, slug));

  if (!entry) {
    notFound();
  }

  const blocks = await db
    .select()
    .from(photojournalBlocks)
    .where(eq(photojournalBlocks.entryId, entry.id))
    .orderBy(asc(photojournalBlocks.position));

  const initialState = {
    title: entry.title,
    slug: entry.slug,
    date: entry.date,
    opener: entry.opener ?? "",
    locationLat: entry.locationLat?.toString() ?? "",
    locationLon: entry.locationLon?.toString() ?? "",
    requireKeyForText: entry.requireKeyForText ?? false,
    previewPhotoUrl: entry.previewPhotoUrl ?? "",
    blocks: blocksToEditorBlocks(blocks),
  };

  return (
    <div>
      <h1 className="text-2xl mb-8">Edit — {entry.title}</h1>
      <MemoryEntryForm initialState={initialState} slug={slug} />
    </div>
  );
}
