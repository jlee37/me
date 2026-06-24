import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "../../../../lib/db";
import { writingEntries } from "../../../../lib/schema";
import ContentPageWrapper from "@/components/ContentPageWrapper";

async function getWriting(slug: string) {
  const [entry] = await db
    .select()
    .from(writingEntries)
    .where(eq(writingEntries.slug, slug));
  return entry ?? null;
}

type WritingPageProps = Promise<{ slug: string }>;

export default async function WritingPage(props: { params: WritingPageProps }) {
  const { slug } = await props.params;
  const writing = await getWriting(slug);

  if (!writing) notFound();

  const { title, heroUrl, content, date } = writing;

  if (!title || !content || !date) return null;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        {heroUrl && (
          <img
            src={heroUrl}
            alt={title}
            className="w-full h-[40%] object-cover rounded-md"
          />
        )}
        <h1 className="text-xl md:text-2xl mt-12">{title}</h1>
        <p className="text-sm mb-6">{formattedDate}</p>
        <div>
          {content.split("\n").map((paragraph, index) => {
            if (!paragraph.trim()) return <div className="h-4" key={index} />;
            return (
              <p key={index} className="indent-8">
                {paragraph}
              </p>
            );
          })}
        </div>
      </ContentPageWrapper>
    </div>
  );
}
