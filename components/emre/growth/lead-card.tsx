"use client";

import type { GrowthLead } from "@/data/growth-types";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/ui-i18n";

interface LeadCardProps {
  lead: GrowthLead;
  onOpen: (lead: GrowthLead) => void;
  onAddCampaign: (lead: GrowthLead) => void;
  onAssignPartner: (lead: GrowthLead) => void;
}

export function LeadCard({ lead, onOpen, onAddCampaign, onAssignPartner }: LeadCardProps) {
  const { t, countryName } = useUi();
  const fitVariant = lead.fitScore >= 80 ? "success" : lead.fitScore >= 65 ? "info" : "warning";

  return (
    <div className="surface-card rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900 text-sm">{lead.company}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(`growth.leadIndustry.${lead.industry}`)} · {countryName(lead.country)} · {lead.city}
          </p>
        </div>
        <StatusBadge variant={fitVariant}>{lead.fitScore}</StatusBadge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge variant="info">{lead.vertical}</StatusBadge>
        <StatusBadge variant={lead.status === "converted" ? "success" : "default"}>{lead.status}</StatusBadge>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2">
        {lead.signal} — {lead.suggestedCampaign}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        <Button size="sm" variant="outline" onClick={() => onOpen(lead)}>
          {t("growth.leads.detail")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onAddCampaign(lead)}>
          {t("growth.leads.addCampaign")}
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onAssignPartner(lead)}>
          {t("growth.leads.assignPartner")}
        </Button>
      </div>
    </div>
  );
}
