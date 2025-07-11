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
  const { title, previewPhoto } = fields;

  // Use preview photo if available, otherwise use first photo
  let imageUrl = "";
  if (previewPhoto?.fields?.file?.url) {
    const baseUrl = previewPhoto.fields.file.url as string;
    const cleanUrl = baseUrl.startsWith("//") ? `https:${baseUrl}` : baseUrl;
    imageUrl = `${cleanUrl}?w=1200&h=630&fit=thumb&fm=jpg&q=30`;
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
}) {
  const { slug } = await props.params;

  const memory = await getMemory(slug);

  if (!memory || !memory.fields) {
    notFound();
  }

  const fields = memory.fields as IMemoryFields;
  const { title, photos, date, opener, requireKeyForText, previewPhoto } =
    fields;

  console.log("JLEE look", previewPhoto);

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
