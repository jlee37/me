"use client";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const mapRef = useRef<google.maps.Map | null>(null);

  const router = useRouter();
  const [zoom, setZoom] = useState(3);

  const [center, setCenter] = useState({ lat: 32.889508, lng: -44.815861 });

  useEffect(() => {
    function updateCenter() {
      if (window.innerWidth <= 768) {
        setCenter({ lat: 30, lng: -98.557527 });
      }
    }

    updateCenter();

    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  const overlayViews = useMemo(() => {
    return coordinates.map((coord, index) => {
      const scale = Math.max(0.5, Math.min(1.5, zoom / 8));
      return (
        <OverlayViewF
          key={index}
          position={coord}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: -width / 2,
            y: -height,
          })}
        >
          <div
            className="relative flex flex-col items-center cursor-pointer transition-transform duration-300 group w-full"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "bottom center",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).dataset.downX =
                e.clientX.toString();
              (e.currentTarget as HTMLElement).dataset.downY =
                e.clientY.toString();
            }}
            onMouseUp={(e) => {
              const target = e.currentTarget as HTMLElement;
              const startX = parseInt(target.dataset.downX || "0", 10);
              const startY = parseInt(target.dataset.downY || "0", 10);
              const dx = Math.abs(e.clientX - startX);
              const dy = Math.abs(e.clientY - startY);
              const dragThreshold = 5; // pixels

              if (dx < dragThreshold && dy < dragThreshold) {
                router.push(`/photojournal/${coord.slug}`);
              }
            }}
          >
            <div className="group cursor-pointer rounded-md border bg-background shadow-lg p-1 group-hover:border-red-700">
              <Image
                src={`${coord.photoUrl}?w=800&h=520&fit=thumb&fm=jpg&q=10`}
                alt={coord.title}
                width={160}
                height={120}
                className="rounded-md object-cover"
              />
              <div
                className={`text-[12px] text-center text-foreground font-quantico overflow-hidden transition-all duration-300 ease-in-out truncate max-w-[160px] w-full ${
                  zoom >= 5
                    ? "opacity-100 max-h-24 pt-1"
                    : "opacity-0 max-h-0 pointer-events-none"
                }`}
              >
                {coord.title}
              </div>
            </div>

            {/* External Caret */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground group-hover:border-t-red-700" />
          </div>
        </OverlayViewF>
      );
    });
  }, [coordinates, zoom]);

  if (!isLoaded) return <p>Loading map...</p>;

  // Center map on the first coordinate
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        options={{
          styles: customMapStyle,
          disableDefaultUI: true, // optional: hide controls
          gestureHandling: "greedy", // smoother mobile UX
        }}
        zoom={zoom}
        onZoomChanged={() => {
          const newZoom = mapRef.current?.getZoom?.();
          if (typeof newZoom === "number") {
            setZoom(newZoom);
          }
        }}
        onLoad={(map) => {
          mapRef.current = map;
          setZoom(map.getZoom() ?? 3);
        }}
      >
        {overlayViews}
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
