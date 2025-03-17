"use client";

import { Quantico } from "next/font/google";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react"; // Hamburger icon
import { useState } from "react";
import Sidebar from "./Sidebar";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center p-4">
      <button className="flex items-center" onClick={handleGoHome}>
        <img
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDByeGFpdWR4ZGtxcmJ3MjAwbTh3ZWM5bWNidmo2bWdjb2t4MHo1ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vxW0QlzKz5StSY3Wjg/giphy.gif"
          className="w-20 h-20 md:w-28 md:h-28 object-contain"
        />
        <div className="ml-2 md:ml-4 text-center md:text-left">
          <div className={`${quantico.className} text-2xl md:text-3xl`}>
            jonny.lee
          </div>
        </div>
      </button>

      {/* Hamburger - only shows on mobile */}
      <button
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Mobile Sidebar */}
      <Sidebar
        isMobile
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default Header;
