"use client";

import { useState } from "react";
import { growthBundles } from "@/data/growth";
import type { GrowthBundle } from "@/data/growth-types";
import { StatusBadge } from "@/components/emre/status-badge";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";
import { useRfq } from "@/context/rfq-context";
import { Button } from "@/components/ui/button";

export function BundleBuilderPanel() {
  const { t, countryName } = useUi();
  const { openCreateRfq } = useRfq();
  const [selected, setSelected] = useState<GrowthBundle | null>(growthBundles[0] ?? null);
  const [verticalFilter, setVerticalFilter] = useState<"all" | "medical" | "robotics">("all");

  const list = growthBundles.filter((b) => verticalFilter === "all" || b.vertical === verticalFilter);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
        <select
          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm mb-2"
          value={verticalFilter}
          onChange={(e) => setVerticalFilter(e.target.value as typeof verticalFilter)}
        >
          <option value="all">{t("common.all")}</option>
          <option value="medical">{t("vertical.medical")}</option>
          <option value="robotics">{t("vertical.robotics")}</option>
        </select>
        {list.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelected(b)}
            className={`w-full text-left surface-card rounded-lg px-3 py-2.5 hover:border-blue-200 ${selected?.id === b.id ? "ring-2 ring-blue-100" : ""}`}
          >
            <p className="text-sm font-medium">{b.name}</p>
            <p className="text-xs text-slate-500">{formatCurrency(b.listPrice)}</p>
          </button>
        ))}
      </div>
      {selected && (
        <div className="lg:col-span-2 surface-card rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{selected.name}</h3>
              <StatusBadge variant="info" className="mt-1">
                {selected.vertical}
              </StatusBadge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(selected.listPrice)}</p>
              <p className="text-xs text-slate-500">
                {t("growth.bundles.leasing")}: {formatCurrency(selected.leasingRateMonthly)}/mo
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <MetricChip label={t("growth.bundles.margin")} value={`${selected.marginPercent}%`} />
            <MetricChip
              label={t("growth.bundles.service")}
              value={selected.includesService ? "✓" : "—"}
            />
            <MetricChip
              label={t("growth.bundles.leasingInc")}
              value={selected.includesLeasing ? "✓" : "—"}
            />
            <MetricChip
              label={t("growth.bundles.training")}
              value={selected.includesTraining ? "✓" : "—"}
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">{t("growth.bundles.products")}</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {selected.products.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.recommendedIndustries.map((i) => (
              <StatusBadge key={i} variant="default">
                {i}
              </StatusBadge>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {t("growth.bundles.territories")}:{" "}
            {selected.recommendedTerritories.map((c) => countryName(c)).join(", ")}
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              openCreateRfq({
                source: "bundle",
                bundleName: selected.name,
                vertical: selected.vertical,
                budget: selected.listPrice,
                deliveryCountry: selected.recommendedTerritories[0],
                leasingInterest: selected.includesLeasing,
                financeInterest: selected.includesLeasing,
              })
            }
          >
            {t("rfq.createRfq")}
          </Button>
        </div>
      )}
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
