"use client";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const DESKTOP_DEFAULT_COORDINATES = {
  lat: 32.889508,
  lng: -44.815861,
};

const MOBILE_DEFAULT_COORDINATES = {
  lat: 35,
  lng: -98.557527,
};

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const latFromSearchParams = searchParams.get("lat");
  const lngFromSearchParams = searchParams.get("lng");

  const initialLat = latFromSearchParams
    ? parseFloat(latFromSearchParams)
    : DESKTOP_DEFAULT_COORDINATES.lat;
  const initialLng = lngFromSearchParams
    ? parseFloat(lngFromSearchParams)
    : DESKTOP_DEFAULT_COORDINATES.lng;

  const initialZoom = parseInt(searchParams.get("zoom") || "3", 10);

  const [zoom, setZoom] = useState(initialZoom);

  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    function updateCenter() {
      if (window.innerWidth <= 768) {
        setCenter({
          lat: MOBILE_DEFAULT_COORDINATES.lat,
          lng: MOBILE_DEFAULT_COORDINATES.lng,
        });
      }
    }

    updateCenter();

    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  function updateUrl(lat: number, lng: number, zoom: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", lat.toFixed(5));
    params.set("lng", lng.toFixed(5));
    params.set("zoom", zoom.toFixed(2));

    router.replace(`${pathname}?${params.toString()}`);
  }

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
            onClick={() => {
              // Mobile: simple tap triggers navigation
              if (window.innerWidth <= 768) {
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
                className={`text-[12px] text-center text-foreground font-quantico overflow-hidden transition-all duration-300 ease-in-out truncate max-w-[160px] w-full pl-2 pr-2 ${
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

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        options={{
          styles: customMapStyle,
          disableDefaultUI: true,
          gestureHandling: "greedy",
        }}
        zoom={zoom}
        onZoomChanged={() => {
          const map = mapRef.current;
          if (map) {
            const center = map.getCenter();
            const newZoom = map.getZoom();
            const lat = center?.lat();
            const lng = center?.lng();
            if (lat && lng && newZoom) {
              setZoom(newZoom);
              updateUrl(lat, lng, newZoom);
            }
          }
        }}
        onCenterChanged={() => {
          const map = mapRef.current;
          if (map) {
            const center = map.getCenter();
            const lat = center?.lat();
            const lng = center?.lng();
            if (lat && lng) {
              updateUrl(lat, lng, zoom);
            }
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
        hue: "#28057a",
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
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#ffffff" }, // white text for park names
      { lightness: 100 }, // brighten if needed
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#000000" }, // optional: black outline for contrast
      { weight: 2 },
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
];
