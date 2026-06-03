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
  const projected = entities.map((e) => ({
    entity: e,
    ...projectLatLng(e.lat, e.lng),
  }));
  const clusters: Cluster[] = [];

  for (const p of projected) {
    const existing = clusters.find(
      (c) =>
        c.role === p.entity.role &&
        Math.hypot(c.x - p.x, c.y - p.y) < threshold
    );
    if (existing) {
      existing.count += 1;
      existing.x = (existing.x * (existing.count - 1) + p.x) / existing.count;
      existing.y = (existing.y * (existing.count - 1) + p.y) / existing.count;
      existing.ids.push(p.entity.id);
    } else {
      clusters.push({
        x: p.x,
        y: p.y,
        count: 1,
        role: p.entity.role,
        ids: [p.entity.id],
      });
    }
  }
  return clusters;
}

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
  const entityMap = useMemo(
    () => new Map(entities.map((e) => [e.id, e])),
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
      .map((r) => {
        const from = entityMap.get(r.fromId);
        const to = entityMap.get(r.toId);
        if (!from || !to) return null;
        const a = projectLatLng(from.lat, from.lng);
        const b = projectLatLng(to.lat, to.lng);
        return { id: r.id, ...a, x2: b.x, y2: b.y, type: r.type };
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
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="heatGrad">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="700" fill="#f8fafc" />
        <rect width="1000" height="700" fill="url(#mapGrid)" opacity="0.6" />

        <g transform={transform}>
          <path
            d={EUROPE_OUTLINE}
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {showTerritories &&
            ["Germany", "France", "Italy", "Spain"].map((c, i) => (
              <ellipse
                key={c}
                cx={220 + i * 140}
                cy={280 + (i % 2) * 80}
                rx={90 + i * 10}
                ry={70}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.5"
              />
            ))}

          {showHeatmap &&
            entities.slice(0, 20).map((e) => {
              const { x, y } = projectLatLng(e.lat, e.lng);
              return (
                <circle
                  key={`heat-${e.id}`}
                  cx={x}
                  cy={y}
                  r={40 + e.activeOrders * 2}
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
            entities.map((e) => {
              const { x, y } = projectLatLng(e.lat, e.lng);
              const color = getMarkerColor(e.role);
              const selected = selectedId === e.id;
              return (
                <g
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => onSelect(e)}
                >
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
                    className={cn(!e.active && "opacity-40")}
                  />
                </g>
              );
            })}

          {showClusters &&
            clusters.map((c, i) => (
              <g
                key={`cluster-${i}`}
                className="cursor-pointer"
                onClick={() => {
                  const first = entityMap.get(c.ids[0]);
                  if (first) onSelect(first);
                }}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={12 + c.count * 1.5}
                  fill={getMarkerColor(c.role)}
                  opacity="0.85"
                />
                <text
                  x={c.x}
                  y={c.y + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {c.count}
                </text>
              </g>
            ))}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-white/90 border border-slate-200 rounded px-2 py-1">
        Map view · Google Maps ready
      </div>
    </div>
  );
}
