"use client";

import type { GrowthLead } from "@/data/growth-types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/emre/status-badge";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";

interface LeadDrawerProps {
  lead: GrowthLead | null;
  onClose: () => void;
  onAddCampaign: (lead: GrowthLead) => void;
  onRfqDraft: (lead: GrowthLead) => void;
  onLeasingOffer: (lead: GrowthLead) => void;
}

export function LeadDrawer({
  lead,
  onClose,
  onAddCampaign,
  onRfqDraft,
  onLeasingOffer,
}: LeadDrawerProps) {
  const { t, countryName } = useUi();
  const { goToSourcing } = useGrowthActions();

  return (
    <Sheet open={!!lead} onOpenChange={() => onClose()}>
      <SheetContent className="surface-card-elevated overflow-y-auto sm:max-w-md">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle>{lead.company}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant="info">{t(`growth.leadIndustry.${lead.industry}`)}</StatusBadge>
                <StatusBadge variant="success">{lead.fitScore} fit</StatusBadge>
                <StatusBadge variant="default">{lead.status}</StatusBadge>
              </div>
              <p>
                <span className="text-slate-500">{t("growth.leads.location")}:</span>{" "}
                {lead.city}, {countryName(lead.country)}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.owner")}:</span> {lead.owner}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.source")}:</span> {lead.source}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.signal")}:</span> {lead.signal}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.productFit")}:</span>{" "}
                {lead.productFit.join(", ")}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.finance")}:</span> {lead.financePotential}
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.service")}:</span> {lead.serviceCoverage}%
              </p>
              <p>
                <span className="text-slate-500">{t("growth.leads.campaign")}:</span> {lead.suggestedCampaign}
              </p>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onAddCampaign(lead)}>
                  {t("growth.leads.addCampaign")}
                </Button>
                <Button variant="outline" onClick={() => onRfqDraft(lead)}>
                  {t("growth.leads.rfqDraft")}
                </Button>
                <Button variant="outline" onClick={() => onLeasingOffer(lead)}>
                  {t("growth.leads.leasingOffer")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToSourcing("lead-discovery", lead.id)}
                >
                  {t("growth.convertSourcing")}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
