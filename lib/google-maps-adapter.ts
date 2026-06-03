import type { MapZoomLevel } from "@/lib/geo";
import type { NetworkEntity, NetworkRoute } from "@/data/types";

export interface GoogleMapsConfig {
  apiKey?: string;
  mapId?: string;
}

export function getGoogleMapsConfig(): GoogleMapsConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  };
}

export function isGoogleMapsConfigured(config: GoogleMapsConfig = getGoogleMapsConfig()): boolean {
  return Boolean(config.apiKey);
}

/** Marker colors by network role — matches platform legend. */
export const ROLE_MARKER_COLORS: Record<string, string> = {
  supplier: "#2563eb",
  dealer: "#16a34a",
  customer: "#64748b",
  service: "#ea580c",
  finance: "#7c3aed",
  showroom: "#dc2626",
};

export function getMarkerColor(role: string): string {
  return ROLE_MARKER_COLORS[role] ?? "#64748b";
}

export const EUROPE_MAP_DEFAULTS = {
  center: { lat: 50.5, lng: 10.5 },
  zoom: 4,
};

export const GOOGLE_ZOOM_BY_LEVEL: Record<MapZoomLevel, number> = {
  europe: 4,
  country: 6,
  region: 8,
  city: 11,
};

export function svgScaleToGoogleZoom(scale: number): number {
  if (scale <= 1) return GOOGLE_ZOOM_BY_LEVEL.europe;
  if (scale <= 2.5) return GOOGLE_ZOOM_BY_LEVEL.country;
  if (scale <= 4) return GOOGLE_ZOOM_BY_LEVEL.region;
  return GOOGLE_ZOOM_BY_LEVEL.city;
}

export function getRouteStrokeColor(type: NetworkRoute["type"]): string {
  switch (type) {
    case "supplier_dealer":
      return "#2563eb";
    case "dealer_customer":
      return "#16a34a";
    case "technician":
      return "#ea580c";
    default:
      return "#94a3b8";
  }
}

export function buildMarkerIcon(
  maps: typeof google.maps,
  color: string,
  selected: boolean,
  active: boolean
): google.maps.Symbol {
  return {
    path: maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: active ? 1 : 0.45,
    strokeColor: "#ffffff",
    strokeWeight: selected ? 3 : 2,
    scale: selected ? 9 : 7,
  };
}

export function buildHeatmapData(
  entities: NetworkEntity[]
): { location: google.maps.LatLng; weight: number }[] {
  return entities.map((entity) => ({
    location: new google.maps.LatLng(entity.lat, entity.lng),
    weight: Math.max(1, entity.activeOrders + entity.activeRfqs),
  }));
}
