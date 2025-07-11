"use client";

import { Preview } from "@/components/Preview";
import { useMemories } from "@/utils/hooks";
import { Suspense } from "react";

export default function PhotojournalPreviewPage() {
  return (
    <Suspense>
      <PhotojournalPreviewPageContent />
    </Suspense>
  );
}

const PhotojournalPreviewPageContent = () => {
  const { data: photojournal } = useMemories();
  const sortedPhotojournal = [...photojournal].sort((a, b) => {
    const dateA = new Date(a.fields.date || 0).getTime();
    const dateB = new Date(b.fields.date || 0).getTime();
    return dateB - dateA;
  });
  const items = sortedPhotojournal.map((memory) => {
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
    const absoluteUrl = url && url.startsWith("//") ? `https:${url}` : url;
    const title = memory.fields.title || "";
    return {
      imageUrl: absoluteUrl || "/placeholder.png", // fallback if no image
      title,
      directToUrl: `/photojournal/${memory.fields.slug}`,
    };
  });
  return <Preview title="Photojournal" items={items} />;
};
