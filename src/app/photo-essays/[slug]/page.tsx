import { notFound } from 'next/navigation';
import client from '../../../../lib/contentful'; // Adjust import if needed

// Fetch a specific photo essay based on the slug
async function getPhotoEssay(slug: string) {
  const res = await client.getEntries({
    content_type: 'photoEssay',
    'fields.slug': slug,
    include: 2, // Includes linked "Photo with Caption" entries
  });

  if (!res.items.length) {
    return null; // Handle not found case
  }

  return res.items[0];
}

// Dynamic Page Component
export default async function PhotoEssayPage({ params }: { params: { slug: string } }) {
  const essay = await getPhotoEssay(params.slug);

  if (!essay) {
    notFound(); // Automatically shows 404 page
  }

  const { title, coverImage, content, photos } = essay.fields;

  console.log("JLEE huh", photos)

  return (
    <div>
      <h1>{title}</h1>
      {coverImage && <img src={coverImage.fields.file.url} alt={title} style={{ maxWidth: '100%' }} />}
      <div>{content}</div>
      <div>
        {photos?.map((entry: any, index: number) => (
          <div key={index}>
            <img src={entry.fields.file.url} alt={entry.fields.caption || `Image ${index + 1}`} />
            <p>{entry.fields.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}