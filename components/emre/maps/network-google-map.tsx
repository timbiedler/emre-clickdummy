"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { NetworkEntity, NetworkRoute } from "@/data/types";
import {
  buildHeatmapData,
  buildMarkerIcon,
  EUROPE_MAP_DEFAULTS,
  getGoogleMapsConfig,
  getMarkerColor,
  getRouteStrokeColor,
  svgScaleToGoogleZoom,
} from "@/lib/google-maps-adapter";
import { cn } from "@/lib/utils";

const LEGEND = [
  ["Suppliers", "#2563eb"],
  ["Dealers", "#16a34a"],
  ["Customers", "#64748b"],
  ["Service", "#ea580c"],
  ["Finance", "#7c3aed"],
  ["Showrooms", "#dc2626"],
] as const;

function MapLayers({
  entities,
  routes,
  selectedId,
  onSelect,
  showClusters,
  showHeatmap,
  showRoutes,
  zoom,
}: {
  entities: NetworkEntity[];
  routes: NetworkRoute[];
  selectedId?: string | null;
  onSelect: (entity: NetworkEntity) => void;
  showClusters: boolean;
  showHeatmap: boolean;
  showRoutes: boolean;
  zoom: number;
}) {
  const map = useMap();
  const visualizationLibrary = useMapsLibrary("visualization");
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  const clearHeatmap = () => {
    const layer = heatmapRef.current as (google.maps.visualization.HeatmapLayer & {
      setMap: (map: google.maps.Map | null) => void;
    }) | null;
    layer?.setMap(null);
    heatmapRef.current = null;
  };

  const entityMap = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities]
  );

  useEffect(() => {
    if (!map) return;
    map.setZoom(svgScaleToGoogleZoom(zoom));
  }, [map, zoom]);

  useEffect(() => {
    if (!map || !selectedId) return;
    const selected = entityMap.get(selectedId);
    if (!selected) return;
    map.panTo({ lat: selected.lat, lng: selected.lng });
  }, [map, selectedId, entityMap]);

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;

    const markers = entities.map((entity) => {
      const marker = new google.maps.Marker({
        position: { lat: entity.lat, lng: entity.lng },
        title: entity.name,
        icon: buildMarkerIcon(
          google.maps,
          getMarkerColor(entity.role),
          selectedId === entity.id,
          entity.active
        ),
        map: showClusters ? null : map,
      });
      marker.addListener("click", () => onSelect(entity));
      return marker;
    });

    markersRef.current = markers;

    if (showClusters) {
      clustererRef.current = new MarkerClusterer({ map, markers });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      clustererRef.current?.clearMarkers();
    };
  }, [map, entities, showClusters, onSelect, selectedId]);

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];

    if (!showRoutes) return;

    polylinesRef.current = routes
      .map((route) => {
        const from = entityMap.get(route.fromId);
        const to = entityMap.get(route.toId);
        if (!from || !to) return null;
        return new google.maps.Polyline({
          path: [
            { lat: from.lat, lng: from.lng },
            { lat: to.lat, lng: to.lng },
          ],
          strokeColor: getRouteStrokeColor(route.type),
          strokeOpacity: 0.45,
          strokeWeight: 2,
          geodesic: true,
          map,
        });
      })
      .filter(Boolean) as google.maps.Polyline[];

    return () => {
      polylinesRef.current.forEach((line) => line.setMap(null));
    };
  }, [map, routes, showRoutes, entityMap]);

  useEffect(() => {
    if (!map || !visualizationLibrary || typeof google === "undefined") return;

    if (heatmapRef.current) {
      clearHeatmap();
    }

    if (!showHeatmap || entities.length === 0) return;

    const HeatmapLayer = google.maps.visualization.HeatmapLayer as unknown as new (options: {
      data: { location: google.maps.LatLng; weight: number }[];
      map: google.maps.Map;
      radius?: number;
      opacity?: number;
    }) => google.maps.visualization.HeatmapLayer;

    heatmapRef.current = new HeatmapLayer({
      data: buildHeatmapData(entities),
      map,
      radius: 28,
      opacity: 0.45,
    });

    return () => {
      clearHeatmap();
    };
  }, [map, visualizationLibrary, entities, showHeatmap]);

  return null;
}

export function NetworkGoogleMap(props: {
  entities: NetworkEntity[];
  routes: NetworkRoute[];
  selectedId?: string | null;
  onSelect: (entity: NetworkEntity) => void;
  showClusters: boolean;
  showHeatmap: boolean;
  showTerritories: boolean;
  showRoutes: boolean;
  zoom?: number;
  className?: string;
}) {
  const config = getGoogleMapsConfig();
  const zoom = props.zoom ?? 1;

  return (
    <APIProvider apiKey={config.apiKey!} libraries={["visualization"]}>
      <div
        className={cn(
          "relative w-full aspect-[10/7] rounded-xl border border-slate-200 overflow-hidden",
          props.className
        )}
      >
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 text-[10px]">
          {LEGEND.map(([label, color]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-md bg-white/95 border border-slate-200 px-2 py-1 text-slate-600 shadow-sm"
            >
              <span className="size-2 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>

        <GoogleMap
          defaultCenter={EUROPE_MAP_DEFAULTS.center}
          defaultZoom={svgScaleToGoogleZoom(zoom)}
          gestureHandling="greedy"
          disableDefaultUI={false}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={false}
          mapId={config.mapId}
          className="w-full h-full"
          reuseMaps
        >
          <MapLayers
            entities={props.entities}
            routes={props.routes}
            selectedId={props.selectedId}
            onSelect={props.onSelect}
            showClusters={props.showClusters}
            showHeatmap={props.showHeatmap}
            showRoutes={props.showRoutes}
            zoom={zoom}
          />
        </GoogleMap>

        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-white/95 border border-slate-200 rounded px-2 py-1 shadow-sm">
          Google Maps
        </div>
      </div>
    </APIProvider>
  );
}
