import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../lib/contentful";
import { IMemoryFields } from "../../../../types/contentful";
import PhotosAndWritings from "@/components/PhotosAndWritings";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import { Asset } from "contentful";
import { HIDDEN_KEY } from "@/constants/hiddenKey";
import Link from "@/components/Link";

async function getMemory(slug: string) {
  const res = await client.getEntries({
    content_type: "memory",
    "fields.slug": slug,
    include: 2,
  });

  if (!res.items.length) {
    return null;
  }

  return res.items[0];
}

type PhotojournalProps = Promise<{
  slug: string;
}>;

// Generate dynamic metadata for each photojournal entry
export async function generateMetadata({
  params,
}: {
  params: PhotojournalProps;
}): Promise<Metadata> {
  const { slug } = await params;
  const memory = await getMemory(slug);

  if (!memory || !memory.fields) {
    return {
      title: "Photojournal Entry - jonny.lee",
      description: "A photojournal entry from jonny.lee",
    };
  }

  const fields = memory.fields as IMemoryFields;
  const { title, previewPhoto } = fields;

  // Use preview photo if available, otherwise use first photo
  let imageUrl = "";
  if (previewPhoto?.fields?.file?.url) {
    const baseUrl = previewPhoto.fields.file.url as string;
    const cleanUrl = baseUrl.startsWith("//") ? `https:${baseUrl}` : baseUrl;
    imageUrl = `${cleanUrl}?w=800&h=420&fit=thumb&fm=jpg&q=10`;
  } else {
    if (memory?.fields?.photos) {
      const photos = memory.fields.photos as Asset[];
      if (photos.length > 0 && photos[0]?.fields?.file?.url) {
        const baseUrl = photos[0].fields.file.url as string;
        const cleanUrl = baseUrl.startsWith("//")
          ? `https:${baseUrl}`
          : baseUrl;
        imageUrl = `${cleanUrl}?w=800&h=420&fit=thumb&fm=jpg&q=10`;
      }
    }
  }
  return {
    title: title,
    openGraph: {
      title: title || "Photojournal Entry",
      url: `https://jonnylee.net/photojournal/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || "Photojournal entry",
        },
      ],
    },
  };
}

export default async function PhotojournalPage(props: {
  params: PhotojournalProps;
  searchParams: Promise<{
    key: string;
  }>;
}) {
  const { slug } = await props.params;
  const { key } = await props.searchParams;

  const memory = await getMemory(slug);

  if (!memory || !memory.fields) {
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

  const hasKey = key === HIDDEN_KEY;
  const showText = !requireKeyForText || hasKey;

  const showAtlasLink = !!location;

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <div className=" mb-6 md:mb-8">
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
        <PhotosAndWritings photos={photos} showText={hasKey} />
      </ContentPageWrapper>
    </div>
  );
}
