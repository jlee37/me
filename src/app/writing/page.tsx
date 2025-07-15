"use client";

import { Preview } from "@/components/Preview";
import { useWriting } from "@/utils/hooks";
import { prefixURL } from "@/utils/utils";
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
  const sortedWritings = [...writings].sort((a, b) => {
    const dateA = new Date(a.fields.date || 0).getTime();
    const dateB = new Date(b.fields.date || 0).getTime();
    return dateB - dateA;
  });
  const items = sortedWritings.map((writing) => {
    const url = writing.fields.heroUrl;
    const title = writing.fields.title || "";
    return {
      imageUrl: prefixURL(url) || "/placeholder.png", // fallback if no image
      title,
      directToUrl: `/writing/${writing.fields.slug}`,
    };
  });
  return <Preview title="Writing" items={items} />;
};
