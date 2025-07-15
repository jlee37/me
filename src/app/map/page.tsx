"use client";

import Map from "@/components/Map";
import { useMemories } from "@/utils/hooks";
import { prefixURL } from "@/utils/utils";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <Suspense>
      <MapPageContent />
    </Suspense>
  );
}

function MapPageContent() {
  const { data: memories } = useMemories();

  const coordinates = memories
    .filter((m) => !!m.fields.location)
    .map((m) => ({
      lat: m.fields.location!.lat,
      lng: m.fields.location!.lon,
      slug: m.fields.slug!,
      title: m.fields.title!,
      photoUrl: prefixURL(m.fields.previewPhoto?.fields.file?.url as string)!,
    }));

  return (
    <div className="w-full h-full md:p-12 p-2">
      <Map coordinates={coordinates} />
    </div>
  );
}
