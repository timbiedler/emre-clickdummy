"use client";

import { useMemo, useState } from "react";
import { growthCampaigns } from "@/data/growth";
import type { GrowthCampaign } from "@/data/growth-types";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";
import { Calendar, List, Rows3 } from "lucide-react";

type CalView = "week" | "month" | "timeline";

interface CampaignCalendarProps {
  onCreateCampaign?: () => void;
  highlightLeadCampaign?: string | null;
}

export function CampaignCalendar({ onCreateCampaign, highlightLeadCampaign }: CampaignCalendarProps) {
  const { t } = useUi();
  const { goToFinance } = useGrowthActions();
  const [view, setView] = useState<CalView>("month");
  const [selected, setSelected] = useState<GrowthCampaign | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    type: "email" as GrowthCampaign["type"],
    budget: 10000,
    territories: "Germany",
  });

  const sorted = useMemo(
    () => [...growthCampaigns].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="inline-flex rounded-lg border border-slate-200 p-1">
          {(
            [
              ["week", Calendar, t("growth.campaigns.week")],
              ["month", List, t("growth.campaigns.month")],
              ["timeline", Rows3, t("growth.campaigns.timeline")],
            ] as const
          ).map(([v, Icon, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md ${view === v ? "bg-blue-50 text-blue-700" : "text-slate-600"}`}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreate(true)}>
          {t("growth.campaigns.create")}
        </Button>
      </div>

      {highlightLeadCampaign && (
        <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
          {t("growth.campaigns.leadQueued")}: {highlightLeadCampaign}
        </p>
      )}

      {view === "timeline" && (
        <div className="space-y-2">
          {sorted.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className="w-full surface-card rounded-lg px-4 py-3 flex items-center gap-4 text-left hover:border-blue-200"
            >
              <div className="w-24 text-xs text-slate-500">
                {c.startDate} → {c.endDate}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-slate-500">{c.channelMix.join(" · ")}</p>
              </div>
              <StatusBadge variant={c.status === "active" ? "success" : "info"}>{c.status}</StatusBadge>
            </button>
          ))}
        </div>
      )}

      {(view === "week" || view === "month") && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sorted.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className="surface-card rounded-xl p-4 text-left hover:border-blue-200"
            >
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {c.type} · €{c.budget.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {c.startDate} — {c.endDate}
              </p>
              <StatusBadge variant="info" className="mt-2">
                {c.vertical}
              </StatusBadge>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="surface-card-elevated overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <span className="text-slate-500">{t("growth.campaigns.owner")}:</span> {selected.owner}
                </p>
                <p>
                  <span className="text-slate-500">{t("growth.campaigns.target")}:</span> {selected.leadsTarget}{" "}
                  leads
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    goToFinance();
                    setSelected(null);
                  }}
                >
                  {t("growth.campaigns.leasingOffer")}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent className="surface-card-elevated overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("growth.campaigns.create")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm">
            <label className="block">
              <span className="text-slate-500">{t("growth.campaigns.name")}</span>
              <input
                className="mt-1 w-full h-9 rounded-lg border border-slate-200 px-3"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-slate-500">{t("growth.campaigns.type")}</span>
              <select
                className="mt-1 w-full h-9 rounded-lg border border-slate-200 px-3"
                value={draft.type}
                onChange={(e) =>
                  setDraft({ ...draft, type: e.target.value as GrowthCampaign["type"] })
                }
              >
                {growthCampaigns.map((c) => c.type).filter((v, i, a) => a.indexOf(v) === i).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-slate-500">{t("growth.campaigns.budget")}</span>
              <input
                type="number"
                className="mt-1 w-full h-9 rounded-lg border border-slate-200 px-3"
                value={draft.budget}
                onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) })}
              />
            </label>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onCreateCampaign?.();
                setShowCreate(false);
              }}
            >
              {t("common.save")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
