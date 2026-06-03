"use client";

import { useState } from "react";
import { growthBudgetPlans } from "@/data/growth";
import type { GrowthBudgetPlan } from "@/data/growth-types";
import { useUi } from "@/lib/ui-i18n";

export function BudgetPlannerPanel() {
  const { t } = useUi();
  const [selected, setSelected] = useState<GrowthBudgetPlan>(growthBudgetPlans[0]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-2 max-h-[520px] overflow-y-auto">
        {growthBudgetPlans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan)}
            className={`w-full text-left surface-card rounded-lg px-4 py-3 hover:border-blue-200 ${selected.id === plan.id ? "ring-2 ring-blue-100" : ""}`}
          >
            <p className="font-medium text-sm">{plan.name}</p>
            <p className="text-xs text-slate-500">
              {plan.period} · €{(plan.totalBudget / 1000).toFixed(0)}k
            </p>
          </button>
        ))}
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="surface-card rounded-xl p-6">
          <h3 className="font-semibold">{selected.name}</h3>
          <p className="text-2xl font-bold mt-2">€{selected.totalBudget.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t("growth.budget.roi")}: {selected.roiEstimate.toFixed(2)}x · {t("growth.budget.potential")}:{" "}
            {selected.territoryPotential}%
          </p>
          <div className="mt-6 space-y-3">
            <BarRow label={t("growth.budget.email")} pct={selected.emailPct} color="bg-blue-500" />
            <BarRow label={t("growth.budget.ads")} pct={selected.adsPct} color="bg-violet-500" />
            <BarRow label={t("growth.budget.partner")} pct={selected.partnerPct} color="bg-emerald-500" />
            <BarRow label={t("growth.budget.landing")} pct={selected.landingPct} color="bg-amber-500" />
          </div>
        </div>
        <div className="surface-card rounded-xl p-6">
          <p className="text-sm font-semibold mb-4">{t("growth.budget.funnel")}</p>
          <div className="flex items-end gap-3 h-32">
            {[
              { label: t("growth.budget.leads"), value: selected.funnelLeads },
              { label: "MQL", value: selected.funnelMql },
              { label: "SQL", value: selected.funnelSql },
              { label: t("growth.budget.won"), value: selected.funnelWon },
            ].map((step) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500/80 rounded-t-md min-h-[8px]"
                  style={{ height: `${(step.value / selected.funnelLeads) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500">{step.label}</span>
                <span className="text-xs font-semibold">{step.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
