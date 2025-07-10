"use client";

import { Preview } from "@/components/Preview";
import { usePhotoEssays } from "@/utils/hooks";
import { Suspense } from "react";

export default function PhotoEssaysPage() {
  return (
    <Suspense>
      <PhotoEssaysPageContent />
    </Suspense>
  );
}

const PhotoEssaysPageContent = () => {
  const { data: photoEssays } = usePhotoEssays();
  const sortedPhotoEssays = [...photoEssays].sort((a, b) => {
    const dateA = new Date(a.fields.date || 0).getTime();
    const dateB = new Date(b.fields.date || 0).getTime();
    return dateB - dateA;
  });
  const items = sortedPhotoEssays.map((photoEssay) => {
    let previewPhoto;
    if (photoEssay.fields.previewPhoto) {
      previewPhoto = photoEssay.fields.previewPhoto;
    } else {
      const photos = photoEssay.fields.photos;
      previewPhoto = photos && photos.length > 0 ? photos[0] : null;
    }

    const url =
      typeof previewPhoto?.fields?.file?.url === "string"
        ? previewPhoto.fields.file.url
        : undefined;
    const absoluteUrl = url && url.startsWith("//") ? `https:${url}` : url;
    const title = photoEssay.fields.title || "";
    return {
      imageUrl: absoluteUrl || "/placeholder.png", // fallback if no image
      title,
      directToUrl: `/photo-essays/${photoEssay.fields.slug}`,
    };
  });
  return <Preview title="Photo Collections" items={items} />;
};
