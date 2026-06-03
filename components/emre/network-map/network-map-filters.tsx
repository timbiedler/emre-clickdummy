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
import { EU_REGIONS, type EuRegionKey } from "@/data/eu-regions";
import { INDUSTRIES } from "@/data/industries";
import type { Vertical } from "@/data/types";
import type { MapZoomLevel } from "@/lib/geo";
import { useUi } from "@/lib/ui-i18n";

export type CoverageView =
  | "none"
  | "performance"
  | "sales_partner"
  | "service"
  | "finance"
  | "expansion";

export interface NetworkMapFiltersState {
  role: string;
  country: string;
  region: EuRegionKey | "all";
  industry: string;
  vertical: Vertical | "all";
  category: string;
  customerType: string;
  activeOnly: boolean;
  showClusters: boolean;
  showHeatmap: boolean;
  showTerritories: boolean;
  showRoutes: boolean;
  showPartnerTerritories: boolean;
  showUnderserved: boolean;
  zoomLevel: MapZoomLevel;
  intelligenceMode: boolean;
  coverageView: CoverageView;
}

export const defaultNetworkFilters: NetworkMapFiltersState = {
  role: "all",
  country: "all",
  region: "all",
  industry: "all",
  vertical: "all",
  category: "all",
  customerType: "all",
  activeOnly: true,
  showClusters: true,
  showHeatmap: false,
  showTerritories: false,
  showRoutes: true,
  showPartnerTerritories: false,
  showUnderserved: false,
  zoomLevel: "europe",
  intelligenceMode: false,
  coverageView: "none",
};

const regionKeys = Object.keys(EU_REGIONS) as EuRegionKey[];

export function NetworkMapFilters({
  filters,
  onChange,
}: {
  filters: NetworkMapFiltersState;
  onChange: (next: NetworkMapFiltersState) => void;
}) {
  const { t, countryName } = useUi();

  const set = <K extends keyof NetworkMapFiltersState>(
    key: K,
    value: NetworkMapFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  const vizOptions: [keyof NetworkMapFiltersState, string][] = [
    ["showClusters", "networkMap.markerClustering"],
    ["showHeatmap", "networkMap.heatmapMode"],
    ["showTerritories", "networkMap.territoryOverlays"],
    ["showRoutes", "networkMap.routeVisualization"],
    ["showPartnerTerritories", "networkMap.partnerTerritories"],
    ["showUnderserved", "networkMap.underservedRegions"],
    ["activeOnly", "networkMap.activePartnersOnly"],
    ["intelligenceMode", "networkMap.networkIntelligenceMode"],
  ];

  return (
    <div className="surface-card p-5 space-y-5 h-fit">
      <p className="text-sm font-semibold text-slate-900">{t("common.filters")}</p>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.region")}</Label>
        <Select
          value={filters.region}
          onValueChange={(v) => {
            set("region", v as EuRegionKey | "all");
            if (v !== "all") set("country", "all");
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("regions.all")}</SelectItem>
            {regionKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`regions.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.networkRole")}</Label>
        <Select value={filters.role} onValueChange={(v) => set("role", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("networkMap.allRoles")}</SelectItem>
            <SelectItem value="supplier">{t("networkMap.suppliersRole")}</SelectItem>
            <SelectItem value="dealer">{t("networkMap.dealersRole")}</SelectItem>
            <SelectItem value="customer">{t("networkMap.customersRole")}</SelectItem>
            <SelectItem value="service">{t("networkMap.serviceRole")}</SelectItem>
            <SelectItem value="finance">{t("networkMap.financeRole")}</SelectItem>
            <SelectItem value="showroom">{t("networkMap.showroomsRole")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.industry")}</Label>
        <Select value={filters.industry} onValueChange={(v) => set("industry", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("networkMap.allIndustries")}</SelectItem>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.customerType")}</Label>
        <Select value={filters.customerType} onValueChange={(v) => set("customerType", v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("networkMap.allTypes")}</SelectItem>
            <SelectItem value="hospital">{t("networkMap.hospitals")}</SelectItem>
            <SelectItem value="care_group">{t("networkMap.careGroups")}</SelectItem>
            <SelectItem value="municipality">{t("networkMap.municipalities")}</SelectItem>
            <SelectItem value="cleaning_company">{t("networkMap.cleaningCompanies")}</SelectItem>
            <SelectItem value="hospitality_group">{t("networkMap.hospitalityGroups")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("marketplace.country")}</Label>
        <Select
          value={filters.country}
          onValueChange={(v) => {
            set("country", v);
            if (v !== "all") set("region", "all");
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("networkMap.allCountries")}</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {countryName(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.coverageView")}</Label>
        <Select
          value={filters.coverageView}
          onValueChange={(v) => set("coverageView", v as CoverageView)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t("networkMap.coverageNone")}</SelectItem>
            <SelectItem value="performance">{t("networkMap.countryPerformance")}</SelectItem>
            <SelectItem value="sales_partner">{t("networkMap.salesPartnerCoverage")}</SelectItem>
            <SelectItem value="service">{t("networkMap.serviceCoverageByCountry")}</SelectItem>
            <SelectItem value="finance">{t("networkMap.financeCoverageByCountry")}</SelectItem>
            <SelectItem value="expansion">{t("networkMap.expansionOpportunities")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("networkMap.mapZoom")}</Label>
        <Select
          value={filters.zoomLevel}
          onValueChange={(v) => set("zoomLevel", v as MapZoomLevel)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="europe">{t("networkMap.europeWide")}</SelectItem>
            <SelectItem value="country">{t("networkMap.countryView")}</SelectItem>
            <SelectItem value="region">{t("networkMap.regionalView")}</SelectItem>
            <SelectItem value="city">{t("networkMap.cityView")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {t("networkMap.visualization")}
        </p>
        {vizOptions.map(([key, labelKey]) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              id={key}
              checked={filters[key] as boolean}
              onCheckedChange={(v) => set(key, Boolean(v) as never)}
            />
            <Label htmlFor={key} className="text-sm text-slate-700 cursor-pointer">
              {t(labelKey)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
