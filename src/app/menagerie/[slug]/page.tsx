import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IPhotoEssayFields } from "../../../../types/contentful";
import PhotosAndWritings from "@/components/PhotosAndWritings";
import ContentPageWrapper from "@/components/ContentPageWrapper";

async function getPhotoEssay(slug: string) {
  const res = await client.getEntries({
    content_type: "photoEssay",
    "fields.slug": slug,
    include: 2,
  });

  if (!res.items.length) {
    return null;
  }

  return res.items[0];
}

type PhotoEssayPageProps = Promise<{
  slug: string;
}>;

export default async function PhotoEssayPage(props: {
  params: PhotoEssayPageProps;
}) {
  const { slug } = await props.params;

  const essay = await getPhotoEssay(slug);

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
      <ContentPageWrapper>
        <h1 className="text-xl md:text-2xl mb-2">{title}</h1>
        <h2 className="text-sm mb-6 md:mb-8">{formattedDate}</h2>
        {opener && <p className="mb-6 md:mb-8 whitespace-pre-line">{opener}</p>}
        <PhotosAndWritings photos={photos} showText />
      </ContentPageWrapper>
    </div>
  );
}
