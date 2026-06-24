import { notFound } from "next/navigation";
import { Metadata } from "next";
import { eq, asc } from "drizzle-orm";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "../../../../lib/db";
import { photojournalEntries, photojournalBlocks } from "../../../../lib/schema";
import { LocalMemory } from "../../../../types/journal";
import { SessionData, sessionOptions } from "../../../../lib/session";
import BlockRenderer from "@/components/BlockRenderer";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import Link from "@/components/Link";

async function getEntry(slug: string): Promise<LocalMemory | null> {
  const [entry] = await db
    .select()
    .from(photojournalEntries)
    .where(eq(photojournalEntries.slug, slug));

  if (!entry) return null;

  const blocks = await db
    .select()
    .from(photojournalBlocks)
    .where(eq(photojournalBlocks.entryId, entry.id))
    .orderBy(asc(photojournalBlocks.position));

  return {
    ...entry,
    opener: entry.opener ?? null,
    previewPhotoUrl: entry.previewPhotoUrl ?? null,
    createdAt: entry.createdAt?.toISOString() ?? "",
    updatedAt: entry.updatedAt?.toISOString() ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blocks: blocks as any,
  };
}

type PhotojournalProps = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: PhotojournalProps;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry(slug);

  if (!entry) {
    return {
      title: "Photojournal Entry - jonny.lee",
      description: "A photojournal entry from jonny.lee",
    };
  }

  return {
    title: entry.title,
    openGraph: {
      type: "article",
      title: entry.title,
      url: `https://jonnylee.net/photojournal/${slug}`,
      ...(entry.previewPhotoUrl && {
        images: [
          {
            url: entry.previewPhotoUrl,
            width: 1200,
            height: 630,
            alt: entry.title,
          },
        ],
      }),
    },
  };
}

export default async function PhotojournalPage(props: {
  params: PhotojournalProps;
}) {
  const { slug } = await props.params;

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  const entry = await getEntry(slug);
  if (!entry) notFound();

  const showText = session.isAdmin ?? false;
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const showAtlasLink = entry.locationLat != null && entry.locationLon != null;

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl mb-2">{entry.title}</h1>
          <h2 className="text-sm">{formattedDate}</h2>
          {showAtlasLink && (
            <Link
              className="text-sm underline"
              href={`/map?lat=${entry.locationLat}&lng=${entry.locationLon}&zoom=10`}
            >
              View in Atlas
            </Link>
          )}
        </div>
        {entry.opener && showText && (
          <p className="mb-6 md:mb-8 whitespace-pre-line">{entry.opener}</p>
        )}
        <BlockRenderer blocks={entry.blocks} showText={showText} />
      </ContentPageWrapper>
    </div>
  );
}
