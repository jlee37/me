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

  return (
    <div>
      <div className={`${quantico.className} text-lg`}>photo essays</div>{" "}
      <div className="ml-6">
        {photoEssays?.map((a) => (
          <Link
            href={`/photo-essays/${a.fields.slug}`}
            key={a.fields.slug}
            className="underline"
          >
            {a.fields.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
