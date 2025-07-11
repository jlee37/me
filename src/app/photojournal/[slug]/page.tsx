import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IMemoryFields } from "../../../../types/contentful";
import PhotosAndWritings from "@/components/WritingsAndPhotos";
import { HIDDEN_KEY } from "@/constants/hiddenKey";

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

export default async function PhotojournalPage(props: {
  params: PhotojournalProps;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const hasValidKey = searchParams["key"] == HIDDEN_KEY;

  const memory = await getMemory(slug);

  if (!memory || !memory.fields) {
    notFound();
  }

  const fields = memory.fields as IMemoryFields;
  const { title, photos, date, opener, requireKeyForText } = fields;

  if (!title || !photos || !date) {
    return null;
  }

  console.log("JLEE look", requireKeyForText);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="md:max-w-[1200px] h-full">
      <PhotosAndWritings
        title={title}
        formattedDate={formattedDate}
        opener={opener}
        photos={photos}
        showText={hasValidKey || !requireKeyForText}
      />
    </div>
  );
}
