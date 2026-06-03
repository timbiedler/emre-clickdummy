/**
 * Stub adapter for future Google Maps integration.
 * Replace `renderMap` implementation with @react-google-maps/api when API key is configured.
 */
import type { NetworkEntity, NetworkRoute } from "@/data/types";

export interface GoogleMapsConfig {
  apiKey?: string;
  mapId?: string;
}

export function isGoogleMapsConfigured(config: GoogleMapsConfig): boolean {
  return Boolean(config.apiKey);
}

export interface MapLayerOptions {
  entities: NetworkEntity[];
  routes: NetworkRoute[];
  showClusters: boolean;
  showHeatmap: boolean;
  showTerritories: boolean;
  showRoutes: boolean;
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
