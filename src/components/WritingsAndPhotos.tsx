"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ContentPageWrapper from "./ContentPageWrapper";
import { Asset } from "contentful";

type WritingsAndPhotosProps = {
  title: string;
  formattedDate: string;
  opener?: string;
  photos: Asset[];
};

function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: "800px", // adjust as needed for mobile
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(node);

    return () => observer.unobserve(node);
  }, [ref, options]);

  return { ref, isVisible };
}
// Nested component for each photo
const WritingsAndPhotosImage = ({ asset }: { asset: Asset }) => {
  const url = asset.fields?.file?.url as string;
  const description = asset.fields?.description as string;
  const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;

  const { ref, isVisible } = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mb-10 md:mb-16" ref={ref}>
      <div className="relative w-full max-w-[1200px]">
        {!loaded && isVisible && (
          <div className="w-full h-[230px] md:h-[600px] bg-gray-800 rounded-md animate-pulse" />
        )}

        {isVisible && (
          <Image
            src={absoluteUrl}
            alt={description || ""}
            width={1200}
            height={800}
            className={`w-full h-auto object-contain rounded-md max-h-[600px] md:max-w-[1200px] transition-opacity duration-500 ${
              loaded ? "" : "h-0"
            }`}
            loading="eager"
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={85}
            onLoadingComplete={() => setLoaded(true)}
          />
        )}
      </div>
      {description && isVisible && (
        <p className="mt-3 whitespace-pre-line text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
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
          ?.map((entry: Asset, index: number) => (
            <WritingsAndPhotosImage key={index} asset={entry} />
          ))}
      </div>
    </ContentPageWrapper>
  );
};

export default WritingsAndPhotos;
