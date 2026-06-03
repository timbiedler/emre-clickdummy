"use client";

import type { NetworkIntelligenceRegion } from "@/data/types";
import { StatusBadge } from "@/components/emre/status-badge";
import { TrendingUp, AlertCircle, MapPinned } from "lucide-react";

const statusVariant = {
  top: "success" as const,
  emerging: "info" as const,
  underserved: "warning" as const,
  stable: "default" as const,
};

const statusLabel = {
  top: "Top region",
  emerging: "Emerging",
  underserved: "Underserved",
  stable: "Stable",
};

export function NetworkIntelligencePanel({
  regions,
}: {
  regions: NetworkIntelligenceRegion[];
}) {
  const sorted = [...regions].sort((a, b) => b.demandScore - a.demandScore);

  return (
    <div className="surface-card p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <MapPinned className="size-4 text-blue-600" />
          Network Intelligence
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Demand hotspots, RFQ density, and expansion opportunities across Europe.
        </p>
      </div>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {sorted.slice(0, 8).map((r) => (
          <div
            key={r.country}
            className="rounded-lg border border-slate-200 bg-white p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-900">{r.country}</p>
              <StatusBadge variant={statusVariant[r.status]}>
                {statusLabel[r.status]}
              </StatusBadge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <span>Demand score: {r.demandScore}</span>
              <span>RFQ density: {r.rfqDensity}/mo</span>
              <span>Order volume: €{(r.orderVolume * 1000).toLocaleString()}</span>
              <span>Service demand: {r.serviceDemand}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${r.demandScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex gap-2">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        <span>
          Poland and Benelux show underserved service coverage — 3 dealer onboarding
          opportunities identified.
        </span>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex gap-2">
        <TrendingUp className="size-4 shrink-0 mt-0.5" />
        <span>
          Finance demand up 18% in Germany and France — leasing partners report
          increased pre-approval volume.
        </span>
      </div>
    </div>
  );
}
