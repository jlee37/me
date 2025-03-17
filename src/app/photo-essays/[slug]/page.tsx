import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IPhotoEssayFields } from "../../../../types/contentful";
import { Asset } from "contentful";

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
    <div className="pt-14 pb-32 px-4 md:px-12 md:mr-20">
      <div className="border border-white rounded-lg p-6 md:p-12 mx-auto mb-16">
        <h1 className="text-xl md:text-2xl mb-2">{title}</h1>
        <h2 className="text-sm mb-6 md:mb-8">{formattedDate}</h2>
        {opener && <p className="mb-6 md:mb-8 whitespace-pre-line">{opener}</p>}
        <div>
          {photos
            ?.filter((entry) => !!entry?.fields?.file?.url)
            ?.map((entry: Asset, index: number) => {
              const url = entry.fields?.file?.url as string;
              const description = entry.fields?.description as string;
              return (
                <div key={index} className="mb-10 md:mb-12">
                  <img
                    src={url}
                    className="w-full h-auto object-contain rounded-md"
                    alt={description}
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
      </div>
    </div>
  );
}
