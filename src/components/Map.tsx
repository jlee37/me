"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

type Coordinate = {
  lat: number;
  lng: number;
  slug: string;
};

type MapProps = {
  coordinates: Coordinate[];
};

export default function Map({ coordinates }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const router = useRouter();

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
          />
        ))}
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
