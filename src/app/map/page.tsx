"use client";

import Map from "@/components/Map";
import { useMemories, useLocalMemories } from "@/utils/hooks";
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
  const { data: contentfulMemories } = useMemories();
  const { data: localMemories } = useLocalMemories();

  const contentfulCoords = contentfulMemories
    .filter((m) => !!m.fields.location)
    .map((m) => ({
      lat: m.fields.location!.lat,
      lng: m.fields.location!.lon,
      slug: m.fields.slug!,
      title: m.fields.title!,
      photoUrl: prefixURL(m.fields.previewPhoto?.fields.file?.url as string)!,
    }));

  const localCoords = localMemories
    .filter((m) => m.locationLat != null && m.locationLon != null)
    .map((m) => ({
      lat: m.locationLat!,
      lng: m.locationLon!,
      slug: m.slug,
      title: m.title,
      photoUrl: m.previewPhotoUrl || "",
    }));

  const coordinates = [...contentfulCoords, ...localCoords];

  return (
    <div className="w-full h-full md:p-12 p-2">
      <Map coordinates={coordinates} />
    </div>
  );
}
