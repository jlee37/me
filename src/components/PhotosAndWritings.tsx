"use client";
import { useState } from "react";
import Image from "next/image";
import { Asset } from "contentful";

// Helper to add Contentful image optimization parameters
function getOptimizedContentfulImageUrl(
  url: string,
  width: number,
  quality = 70,
  format = "webp"
) {
  // Contentful URLs sometimes start with //
  const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;
  const separator = absoluteUrl.includes("?") ? "&" : "?";
  return `${absoluteUrl}${separator}w=${width}&q=${quality}&fm=${format}`;
}

const PhotoAndDescription = ({
  asset,
  eagerLoad,
  showText,
}: {
  asset: Asset;
  eagerLoad: boolean;
  showText: boolean;
}) => {
  const url = asset.fields?.file?.url as string;
  const description = asset.fields?.description as string;

  // Optimize image URL to reduce bandwidth
  // Use width 1200 for desktop, smaller for eager loading if desired
  const optimizedUrl = getOptimizedContentfulImageUrl(url, 1600, 75);

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mb-10 md:mb-16">
      <div className="relative w-full max-w-[1200px]">
        {!loaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-md animate-pulse z-0" />
        )}

        <Image
          src={optimizedUrl}
          alt={description || ""}
          width={1200}
          height={800}
          className={`w-full h-auto rounded-md transition-opacity duration-500 ${
            loaded ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          loading={eagerLoad ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 1200px"
          quality={85}
          onLoadingComplete={() => setLoaded(true)}
          lazyBoundary="1000px"
        />
      </div>
      {/* Description */}
      {description && showText && (
        <p className="mt-3 whitespace-pre-line text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

type PhotosAndWritingsProps = {
  photos: Asset[];
  showText: boolean;
};

const PhotosAndWritings = (props: PhotosAndWritingsProps) => {
  const eagerLoad = props.photos.length <= 20;

  return (
    <div>
      {props.photos
        ?.filter((entry) => !!entry?.fields?.file?.url)
        ?.map((entry: Asset, index: number) => (
          <PhotoAndDescription
            key={index}
            asset={entry}
            eagerLoad={eagerLoad}
            showText={props.showText}
          />
        ))}
    </div>
  );
};

export default PhotosAndWritings;
