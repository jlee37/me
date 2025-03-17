"use client"; // Mark this file as a client component

import { Quantico } from "next/font/google";
import { useRouter } from "next/navigation";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <button className="flex mt-4 ml-4 items-center" onClick={handleGoHome}>
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDByeGFpdWR4ZGtxcmJ3MjAwbTh3ZWM5bWNidmo2bWdjb2t4MHo1ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vxW0QlzKz5StSY3Wjg/giphy.gif"
        className="w-28 h-28 object-contain"
      />
      <div className="mb-4 ml-4">
        <div className={`${quantico.className} text-3xl`}>jonny.lee</div>
      </div>
    </button>
  );
};

export default Header;
