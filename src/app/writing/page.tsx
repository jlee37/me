"use client";

import { Preview } from "@/components/Preview";
import { useWriting } from "@/utils/hooks";
import { Suspense } from "react";

export default function WritingPage() {
  return (
    <Suspense>
      <WritingPageContent />
    </Suspense>
  );
}

const WritingPageContent = () => {
  const { data: writings } = useWriting();
  const items = writings.map((writing) => ({
    imageUrl: writing.heroUrl || "/placeholder.png",
    title: writing.title,
    directToUrl: `/writing/${writing.slug}`,
  }));
  return <Preview title="Writing" items={items} />;
};
