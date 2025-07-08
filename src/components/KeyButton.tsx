"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function KeyButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("key", "jojo");
    router.push(`?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition-colors duration-200 w-[60px] opacity-0"
    >
      X
    </button>
  );
}
