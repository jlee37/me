import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IPhotoEssayFields } from "../../../../types/contentful";
import { Asset } from "contentful";

// Fetch a specific photo essay based on the slug
async function getPhotoEssay(slug: string) {
  const res = await client.getEntries({
    content_type: "photoEssay",
    "fields.slug": slug,
    include: 2, // Includes linked "Photo with Caption" entries
  });

  if (!res.items.length) {
    return null; // Handle not found case
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
    notFound(); // Automatically shows 404 page
  }

  const fields = essay.fields as IPhotoEssayFields;
  const { title, photos, date } = fields;

  if (!title || !photos || !date) {
    return null;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-14 pb-32 pr-12">
      <div className="border-solid border-[1px] border-white rounded-lg p-12">
        <h1 className="text-2xl mb-2">{title}</h1>
        <h2 className="text-sm mb-8">{formattedDate}</h2>
        <div>
          {photos
            ?.filter(
              (entry) =>
                !!entry?.fields?.file?.url && !!entry.fields?.description
            )
            ?.map((entry: Asset, index: number) => {
              const url = entry.fields?.file?.url as string;
              const description = (entry.fields?.description ||
                "No description") as string;
              return (
                <div key={index} className="mb-12  w-[600px]">
                  <img
                    src={url}
                    className="h-[400px] object-contain rounded-md"
                    alt={description}
                  />
                  <p className="mt-3">{description}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
