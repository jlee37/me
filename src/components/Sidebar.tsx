"use client";

import { usePhotoEssays } from "@/utils/hooks";
import { Quantico } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Sidebar = () => {
  return (
    <div className="ml-8 mt-8">
      <AboutSection />
      <PhotoEssaySection />
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className={`${quantico.className} text-lg underline mb-1`}>about</div>
  );
};

const PhotoEssaySection = () => {
  const { data: photoEssays } = usePhotoEssays();
  const pathname = usePathname();

  const sortedEssays = photoEssays
    ? [...photoEssays].sort(
        (a, b) =>
          new Date(b?.fields?.date ?? 0).getTime() -
          new Date(a?.fields?.date ?? 0).getTime()
      )
    : [];

  return (
    <div>
      <div className={`${quantico.className} text-lg underline mb-1`}>
        photo essays
      </div>
      <div className="ml-6">
        {sortedEssays?.map((a) => {
          const isActive = pathname === `/photo-essays/${a.fields.slug}`;

          return (
            <div key={a.fields.title} className="mb-[2px]">
              <Link
                href={`/photo-essays/${a.fields.slug}`}
                key={a.fields.slug}
                className={`hover:text-indigo-400 transition-colors duration-100 ${
                  isActive ? "text-indigo-400" : ""
                }`}
              >
                {a.fields.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
