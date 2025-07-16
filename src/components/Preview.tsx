"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "./Link";

type PreviewBoxProps = {
  imageUrl: string;
  title: string;
  directToUrl: string;
};

function PreviewBox(props: PreviewBoxProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={props.directToUrl} className="w-full">
      <div className="group border border-gray-200 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full md:hover:border-indigo-400 active:border-indigo-400">
        <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden ">
          {!loaded && (
            // Skeleton is the gray animated block shown while loading
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          <Image
            src={props.imageUrl}
            alt={props.title || ""}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className={`object-cover rounded-md transition-opacity duration-500`}
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
        <div className="text-center font-semibold md:mt-2 md:mb-2 transition-colors md:group-hover:text-indigo-400 truncate w-full px-2 active:text-indigo-400 ">
          {props.title}
        </div>
      </div>
    </Link>
  );
}

type PreviewProps = {
  title: string;
  items: {
    imageUrl: string;
    title: string;
    directToUrl: string;
  }[];
  includeAtlasLink?: boolean;
};

export const Preview = (props: PreviewProps) => {
  return (
    <div className="relative pl-4 pr-4 w-full md:mt-12 md:pr-8">
      <h1 className="text-2xl pt-2 mb-0 bg-black">{props.title}</h1>
      {props.includeAtlasLink && (
        <div className="mt-6 mb-6">
          <Link
            className="p-2 border border-foreground rounded-md md:hover:border-indigo-400 transition-colors md:hover:text-indigo-400 active:border-indigo-400 active:text-indigo-400"
            href="/map"
          >
            View atlas
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-4 grid-cols-1 overflow-auto gap-6 mt-4 pb-[200px] md:gap-3">
        {props.items.map((item, i) => (
          <PreviewBox
            imageUrl={item.imageUrl}
            title={item.title}
            directToUrl={item.directToUrl}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};
