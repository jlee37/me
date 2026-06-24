"use client";

import { Preview } from "@/components/Preview";
import AdminPlusButton from "@/components/AdminPlusButton";
import { useLocalMemories } from "@/utils/hooks";
import { Suspense } from "react";

export default function PhotojournalPreviewPage() {
  return (
    <Suspense>
      <PhotojournalPreviewPageContent />
    </Suspense>
  );
}

const PhotojournalPreviewPageContent = () => {
  const { data: memories } = useLocalMemories();

  const items = [...memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((memory) => ({
      imageUrl: memory.previewPhotoUrl || "/placeholder.png",
      title: memory.title,
      directToUrl: `/photojournal/${memory.slug}`,
    }));

  return (
    <Preview
      title="Photojournal"
      items={items}
      includeAtlasLink
      actions={<AdminPlusButton redirectTo="/admin/photojournal/new" inline />}
    />
  );
};
