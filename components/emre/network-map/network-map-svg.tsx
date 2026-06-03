"use client";

import { useMemo } from "react";
import type { NetworkEntity, NetworkRoute } from "@/data/types";
import { projectLatLng } from "@/lib/geo";
import { getMarkerColor } from "@/lib/google-maps-adapter";
import { cn } from "@/lib/utils";

const EUROPE_OUTLINE =
  "M 120,180 L 180,120 L 280,100 L 380,90 L 480,110 L 560,130 L 640,150 L 720,180 L 780,220 L 820,280 L 840,360 L 820,440 L 760,500 L 680,540 L 580,560 L 480,550 L 380,520 L 280,480 L 200,420 L 140,360 L 110,280 Z";

interface Cluster {
  x: number;
  y: number;
  count: number;
  role: string;
  ids: string[];
}

function clusterEntities(entities: NetworkEntity[], threshold = 28): Cluster[] {
  const projected = entities.map((entity) => ({
    entity,
    ...projectLatLng(entity.lat, entity.lng),
  }));
  const clusters: Cluster[] = [];

  for (const point of projected) {
    const existing = clusters.find(
      (cluster) =>
        cluster.role === point.entity.role &&
        Math.hypot(cluster.x - point.x, cluster.y - point.y) < threshold
    );
    if (existing) {
      existing.count += 1;
      existing.x = (existing.x * (existing.count - 1) + point.x) / existing.count;
      existing.y = (existing.y * (existing.count - 1) + point.y) / existing.count;
      existing.ids.push(point.entity.id);
    } else {
      clusters.push({
        x: point.x,
        y: point.y,
        count: 1,
        role: point.entity.role,
        ids: [point.entity.id],
      });
    }
  }
  return clusters;
}

export function NetworkMapSvg({
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
  footerLabel,
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
  footerLabel: string;
}) {
  const entityMap = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities]
  );

  const clusters = useMemo(
    () => (showClusters && zoom <= 1.5 ? clusterEntities(entities) : []),
    [entities, showClusters, zoom]
  );

  const showIndividual = !showClusters || zoom > 1.5;

  const routeLines = useMemo(() => {
    if (!showRoutes) return [];
    return routes
      .map((route) => {
        const from = entityMap.get(route.fromId);
        const to = entityMap.get(route.toId);
        if (!from || !to) return null;
        const start = projectLatLng(from.lat, from.lng);
        const end = projectLatLng(to.lat, to.lng);
        return { id: route.id, ...start, x2: end.x, y2: end.y, type: route.type };
      })
      .filter(Boolean) as {
      id: string;
      x: number;
      y: number;
      x2: number;
      y2: number;
      type: string;
    }[];
  }, [routes, showRoutes, entityMap]);

  const transform = focusPoint
    ? `translate(${500 - focusPoint.x * zoom}, ${350 - focusPoint.y * zoom}) scale(${zoom})`
    : `scale(${zoom}) translate(${500 * (1 - 1 / zoom)}, ${350 * (1 - 1 / zoom)})`;

  return (
    <div className="relative w-full aspect-[10/7] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 text-[10px]">
        {[
          ["Suppliers", "#2563eb"],
          ["Dealers", "#16a34a"],
          ["Customers", "#64748b"],
          ["Service", "#ea580c"],
          ["Finance", "#7c3aed"],
          ["Showrooms", "#dc2626"],
        ].map(([label, color]) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-md bg-white/95 border border-slate-200 px-2 py-1 text-slate-600"
          >
            <span className="size-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <svg viewBox="0 0 1000 700" className="w-full h-full">
        <defs>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="heatGrad">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="700" fill="#f8fafc" />
        <rect width="1000" height="700" fill="url(#mapGrid)" opacity="0.6" />

        <g transform={transform}>
          <path d={EUROPE_OUTLINE} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

          {showTerritories &&
            ["Germany", "France", "Italy", "Spain"].map((country, index) => (
              <ellipse
                key={country}
                cx={220 + index * 140}
                cy={280 + (index % 2) * 80}
                rx={90 + index * 10}
                ry={70}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.5"
              />
            ))}

          {showHeatmap &&
            entities.slice(0, 20).map((entity) => {
              const { x, y } = projectLatLng(entity.lat, entity.lng);
              return (
                <circle
                  key={`heat-${entity.id}`}
                  cx={x}
                  cy={y}
                  r={40 + entity.activeOrders * 2}
                  fill="url(#heatGrad)"
                />
              );
            })}

          {routeLines.map((line) => (
            <line
              key={line.id}
              x1={line.x}
              y1={line.y}
              x2={line.x2}
              y2={line.y2}
              stroke={
                line.type === "supplier_dealer"
                  ? "#2563eb"
                  : line.type === "dealer_customer"
                    ? "#16a34a"
                    : line.type === "technician"
                      ? "#ea580c"
                      : "#94a3b8"
              }
              strokeWidth="1.5"
              strokeOpacity="0.45"
              strokeDasharray={line.type === "spare_parts" ? "4 3" : undefined}
            />
          ))}

          {showIndividual &&
            entities.map((entity) => {
              const { x, y } = projectLatLng(entity.lat, entity.lng);
              const color = getMarkerColor(entity.role);
              const selected = selectedId === entity.id;
              return (
                <g key={entity.id} className="cursor-pointer" onClick={() => onSelect(entity)}>
                  {selected && (
                    <circle cx={x} cy={y} r={14} fill={color} opacity="0.15" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={selected ? 7 : 5}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                    className={cn(!entity.active && "opacity-40")}
                  />
                </g>
              );
            })}

          {showClusters &&
            clusters.map((cluster, index) => (
              <g
                key={`cluster-${index}`}
                className="cursor-pointer"
                onClick={() => {
                  const first = entityMap.get(cluster.ids[0]);
                  if (first) onSelect(first);
                }}
              >
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={12 + cluster.count * 1.5}
                  fill={getMarkerColor(cluster.role)}
                  opacity="0.85"
                />
                <text
                  x={cluster.x}
                  y={cluster.y + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {cluster.count}
                </text>
              </g>
            ))}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-white/90 border border-slate-200 rounded px-2 py-1">
        {footerLabel}
      </div>
    </div>
  );
}
