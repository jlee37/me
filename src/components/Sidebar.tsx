"use client";

import { usePhotoEssays } from "@/utils/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Dialog } from "@headlessui/react";
import { X } from "lucide-react"; // for close icon
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

type SidebarProps = {
  showFullscreen?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar = ({
  showFullscreen = false,
  isOpen = false,
  onClose,
}: SidebarProps) => {
  const currentPathName = usePathname();

  const [key, setKey] = useState(0);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setKey(prev => prev + 1); // Forces re-render
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const content = (
    <div className="ml-4 md:ml-8 mt-4 md:mt-8" key={key}>
      <HomeSection currentPathName={currentPathName} onClose={onClose} />
      <AboutSection currentPathName={currentPathName} onClose={onClose} />
      <PhotoEssaySection
        onLinkClick={onClose}
        currentPathName={currentPathName}
      />
    </div>
  );

  if (!showFullscreen) return content;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose ? () => onClose() : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <Dialog.Panel className="w-full h-full p-8 overflow-y-auto relative">
              <button onClick={onClose} className="absolute top-10 right-4">
                <X size={28} />
              </button>
              {content}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const HomeSection = ({
  currentPathName,
  onClose,
}: {
  currentPathName: string;
  onClose?: () => void;
}) => {
  const isActive = currentPathName === `/`;

  if (isActive) return null;

  return (
    <div><Link
      className={`hover:text-indigo-400 transition-colors duration-100 ${
        isActive ? "text-indigo-400" : ""
      } md:text-lg underline`}
      href="/"
      onClick={onClose}
    >
      home
    </Link></div>
  );
};

const AboutSection = ({
  currentPathName,
  onClose,
}: {
  currentPathName: string;
  onClose?: () => void;
}) => {
  const isActive = currentPathName === `/about`;

  return (
    <div>
    <Link
      className={`hover:text-indigo-400 transition-colors duration-100 ${
        isActive ? "text-indigo-400" : ""
      } md:text-lg underline`}
      href="/about"
      onClick={onClose}
    >
      about
    </Link></div>
  );
};

type PhotoEssaySectionProps = {
  onLinkClick?: () => void;
  currentPathName: string;
};

const PhotoEssaySection = (props: PhotoEssaySectionProps) => {
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
      <div className={`text-base md:text-lg underline mb-1`}>photo essays</div>
      <div className="ml-4 md:ml-6">
        {sortedEssays?.map((a) => {
          const isActive =
            props.currentPathName === `/photo-essays/${a.fields.slug}`;

          return (
            <div key={a.fields.title} className="mb-[2px]">
              <Link
                href={`/photo-essays/${a.fields.slug}`}
                className={`hover:text-indigo-400 transition-colors duration-100 ${
                  isActive ? "text-indigo-400" : ""
                }`}
                onClick={props.onLinkClick}
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
