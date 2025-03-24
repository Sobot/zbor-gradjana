import { LoadScript } from '@react-google-maps/api';

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = ["drawing", "places"];

export default function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
} 