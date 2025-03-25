import { notFound } from "next/navigation";
import client from "../../../../lib/contentful";
import {
  IPhotoEssayFields,
  IWritingFields,
} from "../../../../types/contentful";
import { Asset } from "contentful";
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
  const { title, heroUrl, writingPdf } = fields;

  if (!title || !heroUrl || !writingPdf) {
    return null;
  }

  return (
    <div className="md:w-[70%] h-full">
      <ContentPageWrapper>
        <img
          src={heroUrl}
          alt={title}
          className="w-full h-[40%] object-cover rounded-md my-4"
        />
        <h1 className="text-xl md:text-2xl mb-2 mt-8">{title}</h1>
        <div>
          <p>{writingPdf.fields.title}</p>
        </div>
      </ContentPageWrapper>
    </div>
  );
}
