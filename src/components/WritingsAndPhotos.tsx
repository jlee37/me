import Image from "next/image";
import ContentPageWrapper from "./ContentPageWrapper";
import { Asset } from "contentful";
import Link from "next/link";

type WritingsAndPhotosProps = {
  title: string;
  formattedDate: string;
  opener?: string;
  photos: Asset[];
};

const WritingsAndPhotos = (props: WritingsAndPhotosProps) => {
  return (
    <ContentPageWrapper>
      <h1 className="text-xl md:text-2xl mb-2">{props.title}</h1>
      <h2 className="text-sm mb-6 md:mb-8">{props.formattedDate}</h2>
      {props.opener && (
        <p className="mb-6 md:mb-8 whitespace-pre-line">{props.opener}</p>
      )}
      <div>
        {props.photos
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
                  className="w-full h-auto object-contain rounded-md max-h-[600px] md:max-w-[1200px]"
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
  );
};

export default WritingsAndPhotos;
