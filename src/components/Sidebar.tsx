"use client";

import { usePhotoEssays } from "@/utils/hooks";
import { Quantico } from "next/font/google";
import Link from "next/link";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Sidebar = () => {
  return (
    <div className="ml-8 mt-8">
      <PhotoEssaySection />
    </div>
  );
};

const PhotoEssaySection = () => {
  const { data: photoEssays } = usePhotoEssays();

  const sortedEssays = photoEssays
    ? [...photoEssays].sort(
        (a, b) =>
          new Date(b?.fields?.date ?? 0).getTime() -
          new Date(a?.fields?.date ?? 0).getTime()
      )
    : [];

  return (
    <div>
      <div className={`${quantico.className} text-lg`}>photo essays</div>{" "}
      <div className="ml-6">
        {sortedEssays?.map((a) => (
          <div key={a.fields.title}>
            <Link
              href={`/photo-essays/${a.fields.slug}`}
              key={a.fields.slug}
              className="underline  hover:text-indigo-400 transition-colors duration-300"
            >
              {a.fields.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
