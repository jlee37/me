import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import { IWritingFields } from "../../../../types/contentful";
import ContentPageWrapper from "@/components/ContentPageWrapper";

async function getWriting(slug: string) {
  const res = await client.getEntries({
    content_type: "writing",
    "fields.slug": slug,
    include: 2,
  });

  console.log("JLEE res", res);

  if (!res.items.length) {
    return null;
  }

  return res.items[0];
}

type WritingPageProps = Promise<{
  slug: string;
}>;

export default async function WritingPage(props: { params: WritingPageProps }) {
  const { slug } = await props.params;

  const writing = await getWriting(slug);

  if (!writing || !writing.fields) {
    notFound();
  }

  const fields = writing.fields as IWritingFields;
  const { title, heroUrl, content } = fields;

  if (!title || !heroUrl || !content) {
    return null;
  }

  console.log("JLEE content", content);

  return (
    <div className="md:w-[70%] h-full">
      <ContentPageWrapper>
        <img
          src={heroUrl}
          alt={title}
          className="w-full h-[40%] object-cover rounded-md"
        />
        <h1 className="text-xl md:text-2xl mt-12 mb-6">{title}</h1>
        <div>
          {content.split("\n").map((paragraph, index) => {
            if (!paragraph.trim()) return <div className="h-4" key={index} />;
            return (
              <p key={index} className="indent-8">
                {paragraph}
              </p>
            );
          })}
        </div>
      </ContentPageWrapper>
    </div>
  );
}
