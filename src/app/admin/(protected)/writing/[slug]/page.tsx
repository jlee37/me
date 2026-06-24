import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "../../../../../../lib/db";
import { writingEntries } from "../../../../../../lib/schema";
import WritingEntryForm from "@/components/WritingEntryForm";

type EditPageProps = { params: Promise<{ slug: string }> };

export default async function EditWritingPage({ params }: EditPageProps) {
  const { slug } = await params;

  const [entry] = await db
    .select()
    .from(writingEntries)
    .where(eq(writingEntries.slug, slug));

  if (!entry) notFound();

  return (
    <div>
      <h1 className="text-2xl mb-8">Edit — {entry.title}</h1>
      <WritingEntryForm
        initialState={{
          title: entry.title,
          slug: entry.slug,
          date: entry.date,
          heroUrl: entry.heroUrl ?? "",
          content: entry.content,
        }}
        slug={slug}
      />
    </div>
  );
}
