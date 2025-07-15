"use client";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Updated Coordinate type to include title and photoUrl
// Make sure to pass these fields in the coordinates prop
// e.g. { lat, lng, slug, title, photoUrl }
type Coordinate = {
  lat: number;
  lng: number;
  slug: string;
  title: string;
  photoUrl: string;
};

type MapProps = {
  coordinates: Coordinate[];
};

export default function Map({ coordinates }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!isLoaded) return <p>Loading map...</p>;

  // Center map on the first coordinate
  const center = coordinates[0] ?? { lat: 0, lng: 0 };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={8}
        options={{
          styles: customMapStyle,
          disableDefaultUI: true, // optional: hide controls
          gestureHandling: "greedy", // smoother mobile UX
        }}
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            position={coord}
            onClick={() => router.push(`/photojournal/${coord.slug}`)}
            onMouseOver={() => setHoveredIndex(index)}
            onMouseOut={() =>
              setHoveredIndex((prev) => (prev === index ? null : prev))
            }
          />
        ))}
        <OverlayView
          position={
            hoveredIndex !== null
              ? coordinates[hoveredIndex]
              : { lat: 0, lng: 0 } // dummy fallback to keep overlay rendered
          }
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="relative">
            <div
              className={`absolute bottom-10 left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center rounded bg-white p-2 shadow-lg transition-all duration-300 ${
                hoveredIndex !== null
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {hoveredIndex !== null && (
                <>
                  <Image
                    src={coordinates[hoveredIndex].photoUrl}
                    alt={coordinates[hoveredIndex].title}
                    width={160}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <div className="text-xs text-center text-black mt-2 font-sans">
                    {coordinates[hoveredIndex].title}
                  </div>
                </>
              )}
            </div>
          </div>
        </OverlayView>
      </GoogleMap>
    </div>
  );
}

const customMapStyle = [
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      {
        hue: "#17082e",
      },
      {
        saturation: 46,
      },
      {
        lightness: -86,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [
      {
        hue: "#330b6f",
      },
      {
        saturation: 75,
      },
      {
        lightness: -73,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [
      {
        hue: "#5b2ca2",
      },
      {
        saturation: -43,
      },
      {
        lightness: -37,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [
      {
        hue: "#5b2ca2",
      },
      {
        saturation: 25,
      },
      {
        lightness: -48,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [
      {
        hue: "#ffffff",
      },
      {
        saturation: 0,
      },
      {
        lightness: 100,
      },
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [
      {
        hue: "#ffffff",
      },
      {
        saturation: 0,
      },
      {
        lightness: 100,
      },
      {
        visibility: "off",
      },
    ],
  },
];
