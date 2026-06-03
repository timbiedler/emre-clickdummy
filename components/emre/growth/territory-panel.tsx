"use client";

import { useMemo, useState } from "react";
import { growthTerritories } from "@/data/growth";
import { EU_REGION_LABELS, type EuRegionKey } from "@/data/eu-regions";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";
import type { GrowthTerritory } from "@/data/growth-types";
import { MapPin, Table2 } from "lucide-react";

interface TerritoryPanelProps {
  onSelect?: (t: GrowthTerritory) => void;
}

export function TerritoryPanel({ onSelect }: TerritoryPanelProps) {
  const { t, countryName } = useUi();
  const { goToSourcing } = useGrowthActions();
  const [view, setView] = useState<"map" | "table">("table");
  const [region, setRegion] = useState<EuRegionKey | "all">("all");
  const [selected, setSelected] = useState<GrowthTerritory | null>(null);

  const filtered = useMemo(() => {
    if (region === "all") return growthTerritories;
    return growthTerritories.filter((x) => x.region === region);
  }, [region]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="inline-flex rounded-lg border border-slate-200 p-1">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md ${view === "table" ? "bg-blue-50 text-blue-700" : "text-slate-600"}`}
          >
            <Table2 className="size-3.5" /> {t("growth.territory.tableView")}
          </button>
          <button
            type="button"
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md ${view === "map" ? "bg-blue-50 text-blue-700" : "text-slate-600"}`}
          >
            <MapPin className="size-3.5" /> {t("growth.territory.mapView")}
          </button>
        </div>
        <select
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
          value={region}
          onChange={(e) => setRegion(e.target.value as EuRegionKey | "all")}
        >
          <option value="all">{t("regions.all")}</option>
          {(Object.keys(EU_REGION_LABELS) as EuRegionKey[]).map((k) => (
            <option key={k} value={k}>
              {EU_REGION_LABELS[k]}
            </option>
          ))}
        </select>
      </div>

      {view === "map" && (
        <div className="surface-card rounded-xl p-6 min-h-[220px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 opacity-80" />
          <div className="relative grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filtered.map((ter) => (
              <button
                key={ter.id}
                type="button"
                onClick={() => {
                  setSelected(ter);
                  onSelect?.(ter);
                }}
                className="rounded-lg border border-slate-200 bg-white/90 px-2 py-2 text-left hover:border-blue-300 transition-colors"
                style={{ opacity: 0.55 + ter.expansionScore / 200 }}
              >
                <p className="text-[10px] font-semibold truncate">{countryName(ter.country)}</p>
                <p className="text-[10px] text-slate-500">{ter.expansionScore}</p>
              </button>
            ))}
          </div>
          <p className="relative text-xs text-slate-500 mt-4">{t("growth.territory.mapHint")}</p>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-2">{t("growth.territory.country")}</th>
              <th className="px-4 py-2">{t("growth.territory.potential")}</th>
              <th className="px-4 py-2">{t("growth.territory.leads")}</th>
              <th className="px-4 py-2">{t("growth.territory.partner")}</th>
              <th className="px-4 py-2">{t("growth.territory.whiteSpots")}</th>
              <th className="px-4 py-2">{t("growth.territory.expansion")}</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ter) => (
              <tr
                key={ter.id}
                className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${selected?.id === ter.id ? "bg-blue-50/50" : ""}`}
                onClick={() => {
                  setSelected(ter);
                  onSelect?.(ter);
                }}
              >
                <td className="px-4 py-3 font-medium">{countryName(ter.country)}</td>
                <td className="px-4 py-3">{ter.potentialCustomers}</td>
                <td className="px-4 py-3">{ter.leads}</td>
                <td className="px-4 py-3 text-xs max-w-[140px] truncate">{ter.assignedPartner}</td>
                <td className="px-4 py-3">
                  {ter.whiteSpots > 0 ? (
                    <StatusBadge variant="warning">{ter.whiteSpots}</StatusBadge>
                  ) : (
                    <StatusBadge variant="success">0</StatusBadge>
                  )}
                </td>
                <td className="px-4 py-3">{ter.expansionScore}</td>
                <td className="px-4 py-3">
                  {ter.whiteSpots > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSourcing("territory-white-spot", ter.id);
                      }}
                    >
                      {t("growth.convertSourcing")}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="surface-card rounded-xl p-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">{t("growth.territory.recommendedAction")}</p>
            <p className="font-medium mt-1">{selected.recommendedAction}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">RFQs / Offers</p>
            <p className="font-medium mt-1">
              {selected.openRfqs} / {selected.offers}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("growth.territory.serviceFinance")}</p>
            <p className="font-medium mt-1">
              {selected.serviceCoverage}% / {selected.financeCoverage}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t("growth.territory.leasingPotential")}</p>
            <p className="font-medium mt-1">{selected.leasingPotential}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
