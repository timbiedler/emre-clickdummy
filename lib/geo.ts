/** Geographic projection for Europe-wide map (Google Maps adapter compatible). */

export const EUROPE_BOUNDS = {
  minLat: 36,
  maxLat: 71,
  minLng: -10,
  maxLng: 40,
};

export function projectLatLng(
  lat: number,
  lng: number,
  width = 1000,
  height = 700
): { x: number; y: number } {
  const x =
    ((lng - EUROPE_BOUNDS.minLng) /
      (EUROPE_BOUNDS.maxLng - EUROPE_BOUNDS.minLng)) *
    width;
  const y =
    ((EUROPE_BOUNDS.maxLat - lat) /
      (EUROPE_BOUNDS.maxLat - EUROPE_BOUNDS.minLat)) *
    height;
  return { x, y };
}

export function unprojectPoint(
  x: number,
  y: number,
  width = 1000,
  height = 700
): { lat: number; lng: number } {
  const lng =
    (x / width) * (EUROPE_BOUNDS.maxLng - EUROPE_BOUNDS.minLng) +
    EUROPE_BOUNDS.minLng;
  const lat =
    EUROPE_BOUNDS.maxLat -
    (y / height) * (EUROPE_BOUNDS.maxLat - EUROPE_BOUNDS.minLat);
  return { lat, lng };
}

export type MapZoomLevel = "europe" | "country" | "region" | "city";

export const ZOOM_PRESETS: Record<
  MapZoomLevel,
  { scale: number; label: string }
> = {
  europe: { scale: 1, label: "Europe" },
  country: { scale: 2.2, label: "Country" },
  region: { scale: 3.5, label: "Region" },
  city: { scale: 5.5, label: "City" },
};
