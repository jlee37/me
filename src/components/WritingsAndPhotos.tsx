"use client";
import { useState } from "react";
import Image from "next/image";
import { Asset } from "contentful";
import ContentPageWrapper from "./ContentPageWrapper";

const WritingsAndPhotosImage = ({
  asset,
  eagerLoad,
}: {
  asset: Asset;
  eagerLoad: boolean;
}) => {
  const url = asset.fields?.file?.url as string;
  const description = asset.fields?.description as string;
  const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mb-10 md:mb-16">
      <div className="relative w-full max-w-[1200px] h-[230px] md:h-[600px]">
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-md animate-pulse z-0" />
        )}

        {/* Image */}
        <Image
          src={absoluteUrl}
          alt={description || ""}
          width={1200}
          height={800}
          className={`absolute top-0 left-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ${
            loaded ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          loading={eagerLoad ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={85}
          onLoadingComplete={() => setLoaded(true)}
          lazyBoundary="1000px" // or 1000px if desired
        />
      </div>

      {/* Description */}
      {description && (
        <p className="mt-3 whitespace-pre-line text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
};
type WritingsAndPhotosProps = {
  title: string;
  formattedDate: string;
  opener?: string;
  photos: Asset[];
};
const WritingsAndPhotos = (props: WritingsAndPhotosProps) => {
  const eagerLoad = props.photos.length <= 20;

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
          ?.map((entry: Asset, index: number) => (
            <WritingsAndPhotosImage
              key={index}
              asset={entry}
              eagerLoad={eagerLoad}
            />
          ))}
      </div>
    </ContentPageWrapper>
  );
};

export default WritingsAndPhotos;
