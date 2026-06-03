"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/emre/app-shell";
import { NetworkMapCanvas } from "@/components/emre/network-map/network-map-canvas";
import {
  NetworkMapFilters,
  defaultNetworkFilters,
  type NetworkMapFiltersState,
} from "@/components/emre/network-map/network-map-filters";
import { NetworkEntityDrawer } from "@/components/emre/network-map/network-entity-drawer";
import { NetworkIntelligencePanel } from "@/components/emre/network-map/network-intelligence-panel";
import { MetricCard } from "@/components/emre/metric-card";
import { useApp } from "@/context/app-context";
import {
  filterNetworkEntities,
  networkEntities,
  networkIntelligence,
  networkRoutes,
} from "@/data/network-map";
import { ZOOM_PRESETS } from "@/lib/geo";
import type { NetworkEntity } from "@/data/types";
import { Building2, Users, Wrench, CreditCard } from "lucide-react";

export default function NetworkMapPage() {
  const { vertical } = useApp();
  const [filters, setFilters] = useState<NetworkMapFiltersState>(defaultNetworkFilters);
  const [selected, setSelected] = useState<NetworkEntity | null>(null);

  const filtered = useMemo(() => {
    const verticalFilter =
      filters.vertical === "all" ? vertical : filters.vertical;
    return filterNetworkEntities(networkEntities, {
      role: filters.role,
      country: filters.country,
      vertical: verticalFilter,
      activeOnly: filters.activeOnly,
      category: filters.category,
    });
  }, [filters, vertical]);

  const zoom = ZOOM_PRESETS[filters.zoomLevel].scale;

  const counts = useMemo(() => {
    const byRole = (role: string) =>
      filtered.filter((e) => e.role === role).length;
    return {
      suppliers: byRole("supplier"),
      dealers: byRole("dealer"),
      customers: byRole("customer"),
      service: byRole("service"),
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Map"
        description="Live view of suppliers, dealers, customers, service partners, finance partners, and showrooms across Europe."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Suppliers"
          value={counts.suppliers}
          icon={Building2}
          accent="blue"
        />
        <MetricCard
          label="Dealers"
          value={counts.dealers}
          icon={Users}
          accent="green"
        />
        <MetricCard
          label="Customers"
          value={counts.customers}
          icon={Users}
          accent="slate"
        />
        <MetricCard
          label="Service partners"
          value={counts.service}
          icon={Wrench}
          accent="violet"
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <NetworkMapFilters filters={filters} onChange={setFilters} />

        <div className="lg:col-span-2 space-y-4">
          <NetworkMapCanvas
            entities={filtered}
            routes={networkRoutes}
            selectedId={selected?.id}
            onSelect={setSelected}
            showClusters={filters.showClusters}
            showHeatmap={filters.showHeatmap}
            showTerritories={filters.showTerritories}
            showRoutes={filters.showRoutes}
            zoom={zoom}
          />
          <p className="text-xs text-slate-500">
            {filtered.length} network entities · {networkRoutes.length} active routes ·{" "}
            {vertical === "medical" ? "Medical" : "Robotics"} vertical
          </p>
        </div>

        {filters.intelligenceMode ? (
          <NetworkIntelligencePanel regions={networkIntelligence} />
        ) : (
          <div className="surface-card p-5 space-y-4 h-fit">
            <p className="text-sm font-semibold text-slate-900">Partner overview</p>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {filtered.slice(0, 12).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelected(e)}
                  className="w-full text-left rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900">{e.name}</p>
                  <p className="text-xs text-slate-500">
                    {e.role} · {e.city}, {e.country}
                  </p>
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CreditCard className="size-3.5" />
              Finance partners: {filtered.filter((e) => e.role === "finance").length}
            </div>
          </div>
        )}
      </div>

      <NetworkEntityDrawer
        entity={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
