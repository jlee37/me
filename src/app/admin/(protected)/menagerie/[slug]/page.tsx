import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import db from "../../../../../../lib/db";
import { menagerieEntries, menagerieBlocks } from "../../../../../../lib/schema";
import MemoryEntryForm from "@/components/MemoryEntryForm";
import { blocksToEditorBlocks } from "@/utils/journalUtils";

type EditPageProps = { params: Promise<{ slug: string }> };

export default async function EditMenagerieEntryPage({ params }: EditPageProps) {
  const { slug } = await params;

  const [entry] = await db
    .select()
    .from(menagerieEntries)
    .where(eq(menagerieEntries.slug, slug));

  if (!entry) notFound();

  const blocks = await db
    .select()
    .from(menagerieBlocks)
    .where(eq(menagerieBlocks.entryId, entry.id))
    .orderBy(asc(menagerieBlocks.position));

  const initialState = {
    title: entry.title,
    slug: entry.slug,
    date: entry.date,
    opener: entry.opener ?? "",
    locationLat: entry.locationLat?.toString() ?? "",
    locationLon: entry.locationLon?.toString() ?? "",
    previewPhotoUrl: entry.previewPhotoUrl ?? "",
    blocks: blocksToEditorBlocks(blocks),
  };

  return (
    <div>
      <h1 className="text-2xl mb-8">Edit — {entry.title}</h1>
      <MemoryEntryForm
        initialState={initialState}
        slug={slug}
        apiBase="/api/menagerie"
        backUrl="/admin/menagerie"
      />
    </div>
  );
}
