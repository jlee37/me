"use client";

import { useMemories, usePhotoEssays, useWriting } from "@/utils/hooks";
import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Writing } from "../../types/contentful";

export type SidebarProps = {
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle bfcache restoration
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was restored from bfcache
        setMounted(false);
        setTimeout(() => setMounted(true), 0);
      }
    };

    // Set initial mobile state
    setIsMobile(window.innerWidth < 768);

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pageshow", handlePageShow);
    setMounted(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (!mounted) return null;

  const content = (
    <div className="ml-4 md:ml-8 mt-4 md:mt-8 text-[17px] md:text-base flex flex-col gap-2">
      {!isMobile ||
        (isMobile && showFullscreen && (
          <div>
            <HomeSection currentPathName={currentPathName} onClose={onClose} />
          </div>
        ))}
      <div>
        <AboutSection currentPathName={currentPathName} onClose={onClose} />
      </div>
      <div>
        <WritingSection
          onLinkClick={onClose}
          currentPathName={currentPathName}
          isMobile={isMobile}
          showFullscreen={showFullscreen}
        />
      </div>
      <div>
        <PhotoEssaySection
          onLinkClick={onClose}
          currentPathName={currentPathName}
          isMobile={isMobile}
          showFullscreen={showFullscreen}
        />
      </div>
      <div>
        <MemorySection
          onLinkClick={onClose}
          currentPathName={currentPathName}
          isMobile={isMobile}
          showFullscreen={showFullscreen}
        />
      </div>
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
        className={`hover:md:hover:text-indigo-400 transition-colors duration-100 ${isActive ? "text-indigo-400" : ""} underline`}
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
        className={`hover:text-indigo-400 transition-colors duration-100 ${isActive ? "text-indigo-400" : ""} underline`}
        href="/about"
        onClick={onClose}
      >
        what is this place?
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
  isMobile?: boolean;
  showFullscreen?: boolean;
};

const Section = ({
  title,
  items,
  basePath,
  onLinkClick,
  currentPathName,
  isMobile = false,
  showFullscreen = false,
}: SectionProps) => {
  const sortedItems = items
    ? [...items].sort(
        (a, b) =>
          new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()
      )
    : [];

  return (
    <div
      className={`${!showFullscreen && isMobile ? "cursor-pointer" : "cursor-default"}`}
    >
      <Link
        href={`/${title.replace(/\s+/g, "-")}`}
        className={`underline md:hover:text-indigo-400 transition-colors duration-100 ${currentPathName === `/${title}` ? "text-indigo-400" : ""}`}
      >
        {title}
      </Link>
      <div className={`ml-4 md:ml-6`}>
        {sortedItems?.map((item) => {
          const isActive = currentPathName === `/${basePath}/${item.slug}`;

          return (
            <div key={item.title}>
              <Link
                href={`/${basePath}/${item.slug}`}
                className={`md:hover:text-indigo-400 transition-colors duration-100 text-base ${isActive ? "text-indigo-400" : ""}`}
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

type ContentSectionProps = {
  onLinkClick?: () => void;
  currentPathName: string;
  isMobile?: boolean;
  showFullscreen?: boolean;
};

const WritingSection = (props: ContentSectionProps) => {
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
      isMobile={props.isMobile}
      showFullscreen={props.showFullscreen}
    />
  );
};

const PhotoEssaySection = (props: ContentSectionProps) => {
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
      isMobile={props.isMobile}
      showFullscreen={props.showFullscreen}
    />
  );
};

const MemorySection = (props: ContentSectionProps) => {
  const { data: memories } = useMemories();

  const items =
    memories?.map((memory) => ({
      title: memory.fields.title?.toLowerCase() ?? "",
      slug: memory.fields.slug ?? "",
      date: memory.fields.date,
    })) ?? [];

  const filteredItems = items.filter((item) => !!item);

  return (
    <Section
      title="memories"
      items={filteredItems}
      basePath="memories"
      onLinkClick={props.onLinkClick}
      currentPathName={props.currentPathName}
      isMobile={props.isMobile}
      showFullscreen={props.showFullscreen}
    />
  );
};

export default Sidebar;
