"use client";

import GifCycler from "@/components/GifCycler";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="pt-12 w-full h-full px-4 md:pr-20">
      <GifCycler />
      <div className="md:hidden mt-8">
        <Sidebar />
      </div>
    </div>
  );
}
