"use client";
import GifCycler from "@/components/GifCycler";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

const App = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-screen h-screen">
      {/* Background Gif Layer */}
      <div className="absolute inset-0 bg-emerald-300 z-10">
        <img
          src={"../../haze.gif"}
          alt="Cycling GIF"
          className="w-[100%] h-[100%] object-cover"
        />
      </div>

      {/* Foreground Content */}
      <div className="absolute inset-0 z-20 flex justify-center items-center">
        <div className="w-[92%] h-[92%] bg-black overflow-hidden rounded-2xl border border-solid border-indigo-400">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            <div className="mr-16 flex flex-col">
              <Header />
              <Sidebar />
            </div>
            <main className="flex-1">{children}</main>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden h-full">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Sidebar isMobile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
