"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteEntryButton({ apiUrl }: { apiUrl: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    const res = await fetch(apiUrl, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400">Delete?</span>
        <button
          onClick={handleDelete}
          className="text-xs text-red-400 border border-red-400 rounded px-2 py-1 hover:bg-red-400 hover:text-black transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  );
}
