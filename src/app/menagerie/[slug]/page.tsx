import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { menagerieEntries, menagerieBlocks } from "../../../../lib/schema";
import { SessionData, sessionOptions } from "../../../../lib/session";
import { MemoryBlock } from "../../../../types/journal";
import BlockRenderer from "@/components/BlockRenderer";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import Link from "@/components/Link";

async function getEssay(slug: string) {
  const [entry] = await db
    .select()
    .from(menagerieEntries)
    .where(eq(menagerieEntries.slug, slug));

  if (!entry) return null;

  const blocks = await db
    .select()
    .from(menagerieBlocks)
    .where(eq(menagerieBlocks.entryId, entry.id))
    .orderBy(asc(menagerieBlocks.position));

  return { ...entry, blocks: blocks as unknown as MemoryBlock[] };
}

type MenageriePageProps = Promise<{ slug: string }>;

export default async function MenagerieEssayPage(props: {
  params: MenageriePageProps;
}) {
  const { slug } = await props.params;

  const [essay, session] = await Promise.all([
    getEssay(slug),
    getIronSession<SessionData>(await cookies(), sessionOptions),
  ]);

  if (!essay) notFound();

  const isAdmin = session.isAdmin ?? false;
  const formattedDate = new Date(essay.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <h1 className="text-xl md:text-2xl mb-2">{essay.title}</h1>
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <h2 className="text-sm">{formattedDate}</h2>
          {isAdmin && (
            <Link className="text-sm underline" href={`/admin/menagerie/${slug}`}>
              Edit
            </Link>
          )}
        </div>
        {essay.opener && (
          <p className="mb-6 md:mb-8 whitespace-pre-line">{essay.opener}</p>
        )}
        <BlockRenderer blocks={essay.blocks} showText />
      </ContentPageWrapper>
    </div>
  );
}
