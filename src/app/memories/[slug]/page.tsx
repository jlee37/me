import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IPhotoEssayFields } from "../../../../types/contentful";
import WritingsAndPhotos from "@/components/WritingsAndPhotos";

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

type MemoryPageProps = Promise<{
  slug: string;
}>;

export default async function MemoryPage(props: { params: MemoryPageProps }) {
  const { slug } = await props.params;

  const essay = await getMemory(slug);

  if (!essay || !essay.fields) {
    notFound();
  }

  const fields = essay.fields as IPhotoEssayFields;
  const { title, photos, date, opener } = fields;

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
      <WritingsAndPhotos
        title={title}
        formattedDate={formattedDate}
        opener={opener}
        photos={photos}
      />
    </div>
  );
}
