import { notFound } from "next/navigation";
import { Metadata } from "next";
import { eq, asc } from "drizzle-orm";
import client from "../../../../lib/contentful";
import db from "../../../../lib/db";
import { photojournalEntries, photojournalBlocks } from "../../../../lib/schema";
import { IMemoryFields } from "../../../../types/contentful";
import { LocalMemory } from "../../../../types/journal";
import PhotosAndWritings from "@/components/PhotosAndWritings";
import BlockRenderer from "@/components/BlockRenderer";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import { HIDDEN_KEY } from "@/constants/hiddenKey";
import Link from "@/components/Link";

async function getLocalMemory(slug: string): Promise<LocalMemory | null> {
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
    requireKeyForText: entry.requireKeyForText ?? false,
    previewPhotoUrl: entry.previewPhotoUrl ?? null,
    createdAt: entry.createdAt?.toISOString() ?? "",
    updatedAt: entry.updatedAt?.toISOString() ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blocks: blocks as any,
  };
}

async function getContentfulMemory(slug: string) {
  const res = await client.getEntries({
    content_type: "memory",
    "fields.slug": slug,
    include: 2,
  });
  return res.items.length ? res.items[0] : null;
}

type PhotojournalProps = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: PhotojournalProps;
}): Promise<Metadata> {
  const { slug } = await params;

  const local = await getLocalMemory(slug);
  if (local) {
    const imageUrl = local.previewPhotoUrl ?? "";
    return {
      title: local.title,
      openGraph: {
        type: "article",
        title: local.title,
        url: `https://jonnylee.net/photojournal/${slug}`,
        ...(imageUrl && {
          images: [{ url: imageUrl, width: 1200, height: 630, alt: local.title }],
        }),
      },
    };
  }

  const memory = await getContentfulMemory(slug);
  if (!memory?.fields) {
    return {
      title: "Photojournal Entry - jonny.lee",
      description: "A photojournal entry from jonny.lee",
    };
  }

  const fields = memory.fields as IMemoryFields;
  const { title, previewPhoto } = fields;
  let imageUrl = "";
  if (previewPhoto?.fields?.file?.url) {
    const baseUrl = previewPhoto.fields.file.url as string;
    const cleanUrl = baseUrl.startsWith("//") ? `https:${baseUrl}` : baseUrl;
    imageUrl = `${cleanUrl}?w=800&h=420&fit=thumb&fm=webp&q=70`;
  }

  return {
    title,
    openGraph: {
      type: "article",
      title: title || "Photojournal Entry",
      url: `https://jonnylee.net/photojournal/${slug}`,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title || "Photojournal entry" }],
      }),
    },
  };
}

export default async function PhotojournalPage(props: {
  params: PhotojournalProps;
  searchParams: Promise<{ key: string }>;
}) {
  const { slug } = await props.params;
  const { key } = await props.searchParams;

  const hasKey = key === HIDDEN_KEY;

  // ── Try local (Neon) first ──────────────────────────────────────────────────
  const local = await getLocalMemory(slug);
  if (local) {
    const showText = !local.requireKeyForText || hasKey;
    const formattedDate = new Date(local.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const showAtlasLink = local.locationLat != null && local.locationLon != null;

    return (
      <div className="md:max-w-[1200px] h-full">
        <ContentPageWrapper>
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl mb-2">{local.title}</h1>
            <h2 className="text-sm">{formattedDate}</h2>
            {showAtlasLink && (
              <Link
                className="text-sm underline"
                href={`/map?lat=${local.locationLat}&lng=${local.locationLon}&zoom=10`}
              >
                View in Atlas
              </Link>
            )}
          </div>
          {local.opener && showText && (
            <p className="mb-6 md:mb-8 whitespace-pre-line">{local.opener}</p>
          )}
          <BlockRenderer blocks={local.blocks} showText={showText} />
        </ContentPageWrapper>
      </div>
    );
  }

  // ── Fall back to Contentful ─────────────────────────────────────────────────
  const memory = await getContentfulMemory(slug);
  if (!memory?.fields) {
    notFound();
  }

  const fields = memory.fields as IMemoryFields;
  const { title, photos, date, opener, requireKeyForText, location } = fields;

  if (!title || !photos || !date) {
    return null;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const showText = !requireKeyForText || hasKey;
  const showAtlasLink = !!location;

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl mb-2">{title}</h1>
          <h2 className="text-sm">{formattedDate}</h2>
          {showAtlasLink && (
            <Link
              className="text-sm underline"
              href={`/map?lat=${location.lat}&lng=${location.lon}&zoom=10`}
            >
              View in Atlas
            </Link>
          )}
        </div>
        {opener && showText && (
          <p className="mb-6 md:mb-8 whitespace-pre-line">{opener}</p>
        )}
        <PhotosAndWritings photos={photos} showText={showText} />
      </ContentPageWrapper>
    </div>
  );
}
