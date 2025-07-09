"use client";

import { Preview } from "@/components/Preview";
import { useMemories } from "@/utils/hooks";
import { Suspense } from "react";

export default function MemoriesPage() {
  return (
    <Suspense>
      <MemoriesPageContent />
    </Suspense>
  );
}

const MemoriesPageContent = () => {
  const { data: memories } = useMemories();
  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = new Date(a.fields.date || 0).getTime();
    const dateB = new Date(b.fields.date || 0).getTime();
    return dateB - dateA;
  });
  const items = sortedMemories.map((memory) => {
    const photos = memory.fields.photos;
    const firstPhoto = photos && photos.length > 0 ? photos[0] : null;
    const url =
      typeof firstPhoto?.fields?.file?.url === "string"
        ? firstPhoto.fields.file.url
        : undefined;
    const absoluteUrl = url && url.startsWith("//") ? `https:${url}` : url;
    const title = memory.fields.title || "";
    return {
      imageUrl: absoluteUrl || "/placeholder.png", // fallback if no image
      title,
      directToUrl: `/memories/${memory.fields.slug}`,
    };
  });
  return <Preview title="Memories" items={items} />;
};
