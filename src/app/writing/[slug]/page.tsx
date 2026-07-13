import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { writingEntries } from "../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../lib/session";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import Link from "@/components/Link";

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

  const [writing, session] = await Promise.all([
    getWriting(slug),
    getIronSession<SessionData>(await cookies(), sessionOptions),
  ]);

  if (!writing) notFound();

  const { title, heroUrl, content, date } = writing;

  if (!title || !content || !date) return null;

  const isAdmin = session.isAdmin ?? false;
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
        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm">{formattedDate}</p>
          {isAdmin && (
            <Link className="text-sm underline" href={`/admin/writing/${slug}`}>
              Edit
            </Link>
          )}
        </div>
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
