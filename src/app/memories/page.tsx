"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemories } from "@/utils/hooks";

function MemoryBox({ memory }: { memory: any }) {
  const photos = memory.fields.photos;
  const firstPhoto = photos && photos.length > 0 ? photos[0] : null;
  const url =
    typeof firstPhoto?.fields?.file?.url === "string"
      ? firstPhoto.fields.file.url
      : undefined;
  const absoluteUrl = url && url.startsWith("//") ? `https:${url}` : url;
  const description =
    typeof firstPhoto?.fields?.description === "string"
      ? firstPhoto.fields.description
      : memory.fields.title || "";
  return (
    <Link href={`/memories/${memory.fields.slug}`} className="w-full">
      <div className="group border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full">
        {absoluteUrl && (
          <Image
            src={absoluteUrl}
            alt={description}
            width={300}
            height={200}
            className="object-cover rounded-md mb-2 w-full h-40"
          />
        )}
        <div className="text-center font-semibold mt-2 transition-colors duration-150 group-hover:text-indigo-400">
          {memory.fields.title}
        </div>
      </div>
    </Link>
  );
}

export default function MemoriesPage() {
  const { data: memories } = useMemories();

  // Sort memories by date descending (most recent first)
  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = new Date(a.fields.date || 0).getTime();
    const dateB = new Date(b.fields.date || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="grid grid-cols-4 gap-6 w-full md:mt-12">
      {sortedMemories.map((memory) => (
        <MemoryBox memory={memory} key={memory.fields.slug} />
      ))}
    </div>
  );
}
