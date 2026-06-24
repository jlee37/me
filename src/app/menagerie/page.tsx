"use client";

import { Preview } from "@/components/Preview";
import { useMenagerie } from "@/utils/hooks";
import { Suspense } from "react";

export default function MenageriePage() {
  return (
    <Suspense>
      <MenageriePageContent />
    </Suspense>
  );
}

const MenageriePageContent = () => {
  const { data: essays } = useMenagerie();
  const items = essays.map((essay) => ({
    imageUrl: essay.previewPhotoUrl || "/placeholder.png",
    title: essay.title,
    directToUrl: `/menagerie/${essay.slug}`,
  }));
  return <Preview title="Menagerie" items={items} />;
};
