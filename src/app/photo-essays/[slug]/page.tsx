import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IPhotoEssayFields } from "../../../../types/contentful";
import { Asset } from "contentful";
import ContentPageWrapper from "@/components/ContentPageWrapper";
import Image from "next/image";

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
        <div>
          {photos
            ?.filter((entry) => !!entry?.fields?.file?.url)
            ?.map((entry: Asset, index: number) => {
              const url = entry.fields?.file?.url as string;
              const description = entry.fields?.description as string;
              const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;
              return (
                <div key={index} className="mb-10 md:mb-16">
                  <Image
                    src={absoluteUrl}
                    alt={description || ""}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain rounded-md max-w-full md:max-w-[1200px]"
                    priority={index === 0}
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    quality={85}
                  />
                  {description && (
                    <p className="mt-3 whitespace-pre-line text-sm md:text-base">
                      {description}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </ContentPageWrapper>
    </div>
  );
}
