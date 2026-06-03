"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { NetworkEntity, NetworkRoute } from "@/data/types";
import { getGoogleMapsConfig, isGoogleMapsConfigured } from "@/lib/google-maps-adapter";
import { useUi } from "@/lib/ui-i18n";
import { NetworkMapSvg } from "./network-map-svg";

const NetworkGoogleMap = dynamic(
  () =>
    import("@/components/emre/maps/network-google-map").then((module) => module.NetworkGoogleMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full aspect-[10/7] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

export function NetworkMapCanvas({
  entities,
  routes,
  selectedId,
  onSelect,
  showClusters,
  showHeatmap,
  showTerritories,
  showRoutes,
  zoom = 1,
  focusPoint,
}: {
  entities: NetworkEntity[];
  routes: NetworkRoute[];
  selectedId?: string | null;
  onSelect: (entity: NetworkEntity) => void;
  showClusters: boolean;
  showHeatmap: boolean;
  showTerritories: boolean;
  showRoutes: boolean;
  zoom?: number;
  focusPoint?: { x: number; y: number };
}) {
  const { t } = useUi();
  const config = getGoogleMapsConfig();
  const useGoogleMaps = isGoogleMapsConfigured(config);
  const [mapFailed, setMapFailed] = useState(false);

  if (useGoogleMaps && !mapFailed) {
    return (
      <NetworkGoogleMap
        entities={entities}
        routes={routes}
        selectedId={selectedId}
        onSelect={onSelect}
        showClusters={showClusters}
        showHeatmap={showHeatmap}
        showTerritories={showTerritories}
        showRoutes={showRoutes}
        zoom={zoom}
        onMapError={() => setMapFailed(true)}
      />
    );
  }

  return (
    <NetworkMapSvg
      entities={entities}
      routes={routes}
      selectedId={selectedId}
      onSelect={onSelect}
      showClusters={showClusters}
      showHeatmap={showHeatmap}
      showTerritories={showTerritories}
      showRoutes={showRoutes}
      zoom={zoom}
      focusPoint={focusPoint}
      footerLabel={t("networkMap.demoMapView")}
    />
  );
}
