"use client";

import { Preview } from "@/components/Preview";
import { usePhotoEssays } from "@/utils/hooks";
import { Suspense } from "react";
import { prefixURL } from "../../utils/utils";

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
    const title = photoEssay.fields.title || "";
    return {
      imageUrl: prefixURL(url) || "/placeholder.png", // fallback if no image
      title,
      directToUrl: `/menagerie/${photoEssay.fields.slug}`,
    };
  });
  return <Preview title="Menagerie" items={items} />;
};
