"use client";

import { usePhotoEssays } from "@/utils/hooks";
import { Quantico } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react"; // for close icon
import { useState } from "react";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

type SidebarProps = {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar = ({
  isMobile = false,
  isOpen = false,
  onClose,
}: SidebarProps) => {
  const content = (
    <div className="ml-4 md:ml-8 mt-4 md:mt-8">
      <AboutSection />
      <PhotoEssaySection />
    </div>
  );

  if (!isMobile) return content;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="w-full h-full  p-8 overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 ">
            <X size={28} />
          </button>
          {content}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const AboutSection = () => (
  <div className={`${quantico.className} text-base md:text-lg underline mb-1`}>
    about
  </div>
);

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
      <div
        className={`${quantico.className} text-base md:text-lg underline mb-1`}
      >
        photo essays
      </div>
      <div className="ml-4 md:ml-6">
        {sortedEssays?.map((a) => {
          const isActive = pathname === `/photo-essays/${a.fields.slug}`;

          return (
            <div key={a.fields.title} className="mb-[2px]">
              <Link
                href={`/photo-essays/${a.fields.slug}`}
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
