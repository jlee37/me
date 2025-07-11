import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../lib/contentful";
import { IMemoryFields } from "../../../../types/contentful";
import PhotosAndWritings from "@/components/PhotosAndWritings";
import ContentPageWrapper from "@/components/ContentPageWrapper";

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
  const { title, photos, previewPhoto } = fields;

  // Use preview photo if available, otherwise use first photo
  let imageUrl = "";
  if (previewPhoto?.fields?.file?.url) {
    const url = previewPhoto.fields.file.url as string;
    imageUrl = url.startsWith("//") ? `https:${url}` : url;
  } else if (photos && photos.length > 0 && photos[0]?.fields?.file?.url) {
    const url = photos[0].fields.file.url as string;
    imageUrl = url.startsWith("//") ? `https:${url}` : url;
  }
  return {
    title: title,
    openGraph: {
      title: title || "Photojournal Entry",
      url: `https://jonnylee.net/photojournal/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title || "Photojournal entry",
            },
          ]
        : undefined,
    },
  };
}

export default async function PhotojournalPage(props: {
  params: PhotojournalProps;
}) {
  const { slug } = await props.params;

  const memory = await getMemory(slug);

  if (!memory || !memory.fields) {
    notFound();
  }

  const fields = memory.fields as IMemoryFields;
  const { title, photos, date, opener, requireKeyForText } = fields;

  if (!title || !photos || !date) {
    return null;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <PhotosAndWritings
          title={title}
          formattedDate={formattedDate}
          opener={opener}
          photos={photos}
          requireKeyForText={!!requireKeyForText}
        />
      </ContentPageWrapper>
    </div>
  );
}
