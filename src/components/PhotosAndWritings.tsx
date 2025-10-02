"use client";
import { useState } from "react";
import Image from "next/image";
import { Asset } from "contentful";
import { useIntersectionObserver } from "../utils/hooks";

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
  const optimizedUrl = getOptimizedContentfulImageUrl(url, 1600, 75);

  const [loaded, setLoaded] = useState(false);

  // Use intersection observer to start loading images well before they appear
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "2000px", // Start loading 2000px before entering viewport
    threshold: 0,
    triggerOnce: true,
  });

  // Determine if we should start loading the image
  const shouldLoad = eagerLoad || hasIntersected;

  return (
    <div ref={ref} className="mb-10 md:mb-16">
      <div className="relative w-full max-w-[1200px]">
        {!loaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-md animate-pulse z-0" />
        )}

        {shouldLoad && (
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
            priority={eagerLoad}
          />
        )}
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
