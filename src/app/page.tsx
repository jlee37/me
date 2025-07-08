"use client";

import GifCycler from "@/components/GifCycler";
import SidebarWithSuspense from "@/components/SidebarWithSuspense";
import { usePathname } from "next/navigation";

export default function Home() {
  return (
    <div className="md:pt-12 pt-2 w-full h-full px-4 md:pr-20">
      <GifCycler />
      <div className="md:hidden mt-8 pb-48">
        <SidebarWithSuspense key={usePathname()} />
      </div>
    </div>
  );
}
