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
  const { title, heroUrl, content, date } = fields;

  if (!title || !heroUrl || !content || !date) {
    return null;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="md:max-w-[1200px] h-full">
      <ContentPageWrapper>
        <img
          src={heroUrl}
          alt={title}
          className="w-full h-[40%] object-cover rounded-md"
        />
        <h1 className="text-xl md:text-2xl mt-12">{title}</h1>
        <p className="text-sm mb-6">{formattedDate}</p>
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
