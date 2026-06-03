"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES } from "@/data/constants";
import type { Vertical } from "@/data/types";
import type { MapZoomLevel } from "@/lib/geo";

export interface NetworkMapFiltersState {
  role: string;
  country: string;
  vertical: Vertical | "all";
  category: string;
  activeOnly: boolean;
  showClusters: boolean;
  showHeatmap: boolean;
  showTerritories: boolean;
  showRoutes: boolean;
  zoomLevel: MapZoomLevel;
  intelligenceMode: boolean;
}

export const defaultNetworkFilters: NetworkMapFiltersState = {
  role: "all",
  country: "all",
  vertical: "all",
  category: "all",
  activeOnly: true,
  showClusters: true,
  showHeatmap: false,
  showTerritories: false,
  showRoutes: true,
  zoomLevel: "europe",
  intelligenceMode: false,
};

export function NetworkMapFilters({
  filters,
  onChange,
}: {
  filters: NetworkMapFiltersState;
  onChange: (next: NetworkMapFiltersState) => void;
}) {
  const set = <K extends keyof NetworkMapFiltersState>(
    key: K,
    value: NetworkMapFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="surface-card p-5 space-y-5 h-fit">
      <p className="text-sm font-semibold text-slate-900">Filters</p>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Network role</Label>
        <Select value={filters.role} onValueChange={(v) => set("role", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="supplier">Suppliers</SelectItem>
            <SelectItem value="dealer">Dealers</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="service">Service partners</SelectItem>
            <SelectItem value="finance">Finance partners</SelectItem>
            <SelectItem value="showroom">Showrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Country</Label>
        <Select value={filters.country} onValueChange={(v) => set("country", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Map zoom</Label>
        <Select
          value={filters.zoomLevel}
          onValueChange={(v) => set("zoomLevel", v as MapZoomLevel)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="europe">Europe-wide</SelectItem>
            <SelectItem value="country">Country view</SelectItem>
            <SelectItem value="region">Regional view</SelectItem>
            <SelectItem value="city">City view</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Visualization
        </p>
        {[
          ["showClusters", "Marker clustering"],
          ["showHeatmap", "Heatmap mode"],
          ["showTerritories", "Territory overlays"],
          ["showRoutes", "Route visualization"],
          ["activeOnly", "Active partners only"],
          ["intelligenceMode", "Network intelligence"],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              id={key}
              checked={filters[key as keyof NetworkMapFiltersState] as boolean}
              onCheckedChange={(v) =>
                set(key as keyof NetworkMapFiltersState, Boolean(v) as never)
              }
            />
            <Label htmlFor={key} className="text-sm text-slate-700 cursor-pointer">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
