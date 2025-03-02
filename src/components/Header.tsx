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
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm1yc3kwNDk5cDNlcDlpNWExZTF5YXY0bDRnem1kd2Ztb3YzZjFtYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/n4793Frdg4tFVC7jWI/giphy.gif"
        className="w-32 h-32 object-contain"
      />
      <div className="mb-4 ml-4">
        <div className={`${quantico.className} text-3xl`}>jojo.wow</div>
      </div>
    </button>
  );
};

export default Header;
