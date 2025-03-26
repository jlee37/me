"use client";

import { usePhotoEssays, useWriting } from "@/utils/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Dialog } from "@headlessui/react";
import { X } from "lucide-react"; // for close icon
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Writing } from "../../types/contentful";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Handle bfcache restoration
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was restored from bfcache
        setMounted(false);
        setTimeout(() => setMounted(true), 0);
      }
    };

    setMounted(true);
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (!mounted) return null;

  const content = (
    <div className="ml-4 md:ml-8 mt-4 md:mt-8">
      <HomeSection currentPathName={currentPathName} onClose={onClose} />
      <AboutSection currentPathName={currentPathName} onClose={onClose} />
      <WritingSection onLinkClick={onClose} currentPathName={currentPathName} />
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

  return (
    <div>
      <Link
        className={`hover:text-indigo-400 transition-colors duration-100 ${
          isActive ? "text-indigo-400" : ""
        } md:text-lg underline`}
        href="/"
        onClick={onClose}
      >
        home
      </Link>
    </div>
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
      </Link>
    </div>
  );
};

type SectionProps = {
  title: string;
  items: Array<{
    title: string;
    slug: string;
    date?: string;
  }>;
  basePath: string;
  onLinkClick?: () => void;
  currentPathName: string;
};

const Section = ({
  title,
  items,
  basePath,
  onLinkClick,
  currentPathName,
}: SectionProps) => {
  const sortedItems = items
    ? [...items].sort(
        (a, b) =>
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
      )
    : [];

  return (
    <div>
      <div className={`text-base md:text-lg underline mb-1`}>{title}</div>
      <div className="ml-4 md:ml-6">
        {sortedItems?.map((item) => {
          const isActive = currentPathName === `/${basePath}/${item.slug}`;

          return (
            <div key={item.title} className="mb-[2px]">
              <Link
                href={`/${basePath}/${item.slug}`}
                className={`hover:text-indigo-400 transition-colors duration-100 ${
                  isActive ? "text-indigo-400" : ""
                }`}
                onClick={onLinkClick}
              >
                {item.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type PhotoEssaySectionProps = {
  onLinkClick?: () => void;
  currentPathName: string;
};

const PhotoEssaySection = (props: PhotoEssaySectionProps) => {
  const { data: photoEssays } = usePhotoEssays();

  const items =
    photoEssays?.map((essay) => ({
      title: essay.fields.title?.toLowerCase() ?? "",
      slug: essay.fields.slug ?? "",
      date: essay.fields.date,
    })) ?? [];

  return (
    <Section
      title="photo essays"
      items={items}
      basePath="photo-essays"
      onLinkClick={props.onLinkClick}
      currentPathName={props.currentPathName}
    />
  );
};

type WritingSectionProps = {
  onLinkClick?: () => void;
  currentPathName: string;
};

const WritingSection = (props: WritingSectionProps) => {
  const { data: writings } = useWriting();

  const items =
    writings?.map((writing: Writing) => ({
      title: writing.fields.title?.toLowerCase() ?? "",
      slug: writing.fields.title?.toLowerCase().replace(/\s+/g, "-") ?? "",
      date: writing.fields.date,
    })) ?? [];

  return (
    <Section
      title="writing"
      items={items}
      basePath="writing"
      onLinkClick={props.onLinkClick}
      currentPathName={props.currentPathName}
    />
  );
};

export default Sidebar;
