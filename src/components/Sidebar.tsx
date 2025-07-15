"use client";

import { useMemories, usePhotoEssays, useWriting } from "@/utils/hooks";
import Link from "@/components/Link";
import { usePathname } from "next/navigation";
import { Section, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo, useEffect, useState } from "react";
import { Writing } from "../../types/contentful";
import { SidebarSection } from "./SidebarSection";

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

  const { data: writings } = useWriting();

  const { data: memories } = useMemories();

  const { data: photoEssays } = usePhotoEssays();

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
          <SidebarSection
            title="home"
            basePath="home"
            currentPathName={currentPathName}
            onLinkClick={onClose}
          />
        ))}
      <SidebarSection
        title="what is this place?"
        basePath="about"
        currentPathName={currentPathName}
        onLinkClick={onClose}
      />
      <SidebarSection
        title="trotting"
        basePath="map"
        onLinkClick={onClose}
        currentPathName={currentPathName}
        isMobile={isMobile}
        showFullscreen={showFullscreen}
      />
      <SidebarSection
        title="writing"
        basePath="writing"
        realItems={writings}
        onLinkClick={onClose}
        currentPathName={currentPathName}
        isMobile={isMobile}
        showFullscreen={showFullscreen}
      />
      <SidebarSection
        title="photojournal"
        basePath="photojournal"
        realItems={memories}
        onLinkClick={onClose}
        currentPathName={currentPathName}
        isMobile={isMobile}
        showFullscreen={showFullscreen}
      />
      <SidebarSection
        title="photo essays"
        basePath="photo-essays"
        realItems={photoEssays}
        onLinkClick={onClose}
        currentPathName={currentPathName}
        isMobile={isMobile}
        showFullscreen={showFullscreen}
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

export default Sidebar;
