"use client";

import { Preview } from "@/components/Preview";
import { useMemories, useLocalMemories } from "@/utils/hooks";
import { prefixURL } from "@/utils/utils";
import { Suspense } from "react";

export default function PhotojournalPreviewPage() {
  return (
    <Suspense>
      <PhotojournalPreviewPageContent />
    </Suspense>
  );
}

const PhotojournalPreviewPageContent = () => {
  const { data: contentfulMemories } = useMemories();
  const { data: localMemories } = useLocalMemories();

  const contentfulItems = contentfulMemories.map((memory) => {
    let previewPhoto;
    if (memory.fields.previewPhoto) {
      previewPhoto = memory.fields.previewPhoto;
    } else {
      const photos = memory.fields.photos;
      previewPhoto = photos && photos.length > 0 ? photos[0] : null;
    }
    const url =
      typeof previewPhoto?.fields?.file?.url === "string"
        ? previewPhoto.fields.file.url
        : undefined;
    return {
      imageUrl: prefixURL(url) || "/placeholder.png",
      title: memory.fields.title || "",
      directToUrl: `/photojournal/${memory.fields.slug}`,
      date: memory.fields.date || "1970-01-01",
    };
  });

  const localItems = localMemories.map((memory) => ({
    imageUrl: memory.previewPhotoUrl || "/placeholder.png",
    title: memory.title,
    directToUrl: `/photojournal/${memory.slug}`,
    date: memory.date,
  }));

  const allItems = [...contentfulItems, ...localItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return <Preview title="Photojournal" items={allItems} includeAtlasLink />;
};
