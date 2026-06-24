"use client";

import Map from "@/components/Map";
import { useLocalMemories } from "@/utils/hooks";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <Suspense>
      <MapPageContent />
    </Suspense>
  );
}

function MapPageContent() {
  const { data: memories } = useLocalMemories();

  const coordinates = memories
    .filter((m) => m.locationLat != null && m.locationLon != null)
    .map((m) => ({
      lat: m.locationLat!,
      lng: m.locationLon!,
      slug: m.slug,
      title: m.title,
      photoUrl: m.previewPhotoUrl || "",
    }));

  return (
    <div className="w-full h-full md:p-12 p-2">
      <Map coordinates={coordinates} />
    </div>
  );
}
