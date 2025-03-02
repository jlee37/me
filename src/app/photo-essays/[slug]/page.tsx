import { notFound } from "next/navigation";
import client from "../../../../lib/contentful"; // Adjust import if needed
import { IPhotoEssayFields } from "../../../../types/contentful";

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

// Dynamic Page Component
export default async function PhotoEssayPage({
  params,
}: {
  params: { slug: string };
}) {
  const essay = await getPhotoEssay(params.slug);

  if (!essay || !essay.fields) {
    notFound(); // Automatically shows 404 page
  }

  const fields = essay.fields as IPhotoEssayFields;

  const { title, coverImage, content, photos } = fields;

  return (
    <div className="pt-32 pb-32 pr-12">
      <div className="border-solid border-[1px] border-white rounded-lg p-12">
        <h1 className="text-2xl mb-8">{title}</h1>
        {coverImage && (
          <img
            src={coverImage.fields.file.url}
            alt={title}
            style={{ maxWidth: "100%" }}
          />
        )}
        <div>{content}</div>
        <div>
          {photos?.map((entry: any, index: number) => (
            <div key={index} className="mb-12">
              <img
                src={entry.fields.file.url}
                alt={entry.fields.caption || `Image ${index + 1}`}
                className="h-[400px] w-[600px] object-contain"
              />
              <p className="mt-2">{entry.fields.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
