"use client";

import { useMemo, useState } from "react";
import { growthLeads } from "@/data/growth";
import type { GrowthLead, GrowthVertical, LeadStatus } from "@/data/growth-types";
import { LeadCard } from "./lead-card";
import { LeadDrawer } from "./lead-drawer";
import { Input } from "@/components/ui/input";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";

interface LeadDiscoveryPanelProps {
  onToast?: (msg: string) => void;
  onSelectCampaignLead?: (lead: GrowthLead) => void;
}

export function LeadDiscoveryPanel({ onToast, onSelectCampaignLead }: LeadDiscoveryPanelProps) {
  const { t } = useUi();
  const { goToFinance, openRfqFromLead } = useGrowthActions();
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState<GrowthVertical | "all">("all");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<GrowthLead | null>(null);

  const filtered = useMemo(() => {
    return growthLeads.filter((l) => {
      if (vertical !== "all" && l.vertical !== vertical) return false;
      if (status !== "all" && l.status !== status) return false;
      if (search && !l.company.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, vertical, status]);

  const notify = (msg: string) => onToast?.(msg);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("growth.leads.search")}
          className="max-w-xs h-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
          value={vertical}
          onChange={(e) => setVertical(e.target.value as GrowthVertical | "all")}
        >
          <option value="all">{t("common.all")}</option>
          <option value="medical">{t("vertical.medical")}</option>
          <option value="robotics">{t("vertical.robotics")}</option>
        </select>
        <select
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus | "all")}
        >
          <option value="all">{t("common.all")}</option>
          {(["new", "qualified", "nurturing", "assigned", "converted", "disqualified"] as LeadStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <p className="text-xs text-slate-500 self-center">
          {filtered.length} / {growthLeads.length} {t("growth.leads.countLabel")}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto pr-1">
        {filtered.slice(0, 60).map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onOpen={setSelected}
            onAddCampaign={(l) => {
              onSelectCampaignLead?.(l);
              notify(t("growth.leads.addedToCampaign"));
            }}
            onAssignPartner={(l) => notify(`${t("growth.leads.assignPartner")}: ${l.company}`)}
          />
        ))}
      </div>
      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onAddCampaign={(l) => {
          onSelectCampaignLead?.(l);
          notify(t("growth.leads.addedToCampaign"));
        }}
        onRfqDraft={(l) => {
          notify(t("growth.leads.rfqDraft"));
          openRfqFromLead(l);
        }}
        onLeasingOffer={() => {
          notify(t("growth.leads.leasingOffer"));
          goToFinance();
        }}
      />
    </div>
  );
}
