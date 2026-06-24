"use client";

import { useState } from "react";
import Image from "next/image";
import { MemoryBlock, PhotoBlockContent, TextBlockContent } from "../../types/journal";
import { useIntersectionObserver } from "../utils/hooks";

function PhotoBlockItem({
  content,
  eagerLoad,
  showText,
}: {
  content: PhotoBlockContent;
  eagerLoad: boolean;
  showText: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "2000px",
    threshold: 0,
    triggerOnce: true,
  });

  const shouldLoad = eagerLoad || hasIntersected;

  return (
    <div ref={ref} className="mb-10 md:mb-16">
      <div className="relative w-full max-w-[1200px]">
        {!loaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-md animate-pulse z-0" />
        )}
        {shouldLoad && (
          <Image
            src={content.url}
            alt={content.alt || ""}
            width={content.width || 1200}
            height={content.height || 800}
            className={`w-full h-auto rounded-md transition-opacity duration-500 ${
              loaded ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            loading={eagerLoad ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={85}
            onLoad={() => setLoaded(true)}
            priority={eagerLoad}
          />
        )}
      </div>
      {content.alt && showText && (
        <p className="mt-3 whitespace-pre-line text-sm md:text-base">
          {content.alt}
        </p>
      )}
    </div>
  );
}

function TextBlockItem({ content }: { content: TextBlockContent }) {
  return (
    <div
      className="mb-6 md:mb-8 prose prose-invert max-w-none text-sm md:text-base"
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}

type BlockRendererProps = {
  blocks: MemoryBlock[];
  showText: boolean;
};

export default function BlockRenderer({ blocks, showText }: BlockRendererProps) {
  const eagerLoad = blocks.filter((b) => b.type === "photo").length <= 20;

  return (
    <div>
      {blocks.map((block) => {
        if (block.type === "photo") {
          return (
            <PhotoBlockItem
              key={block.id}
              content={block.content as PhotoBlockContent}
              eagerLoad={eagerLoad}
              showText={showText}
            />
          );
        }
        if (block.type === "text") {
          return showText ? (
            <TextBlockItem
              key={block.id}
              content={block.content as TextBlockContent}
            />
          ) : null;
        }
        return null;
      })}
    </div>
  );
}
