"use client";

import { Banknote, CheckCheck, Clock3, Percent } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { commissionModels, salesPartners } from "@/data/sales-partners";

export default function SalesPartnerCommissionsPage() {
  const pendingAmount = salesPartners.slice(0, 5).reduce((sum, partner) => sum + partner.pipelineValue * 0.08, 0);

  return (
    <PortalDashboard
      title="Commission Status"
      description="Review payout cycles, resolve pending approvals, and ensure commission models align with signed contracts."
      kpis={[
        { label: "Pending payouts", value: `€${Math.round(pendingAmount / 1_000)}k`, change: -4, icon: Clock3, accent: "blue" },
        { label: "Approved this month", value: "€418k", change: 9, icon: CheckCheck, accent: "green" },
        { label: "Average commission", value: "8.6%", change: 2, icon: Percent, accent: "violet" },
        { label: "Payout batches", value: 6, change: 0, icon: Banknote, accent: "slate" },
      ]}
      tables={[
        {
          title: "Partner payout queue",
          rows: salesPartners.slice(0, 7).map((partner, index) => ({
            cols: [
              partner.name,
              partner.commissionModel,
              `€${Math.round((partner.pipelineValue * 0.08) / 1_000)}k`,
              index % 2 === 0 ? "approved" : "review",
            ],
          })),
        },
        {
          title: "Active commission models",
          rows: commissionModels.slice(0, 6).map((model) => ({
            cols: [model.name, model.type, model.rate, model.regions[0], "approved"],
          })),
        },
      ]}
      actions={[
        { label: "View pipeline", href: "/sales-partner/pipeline" },
        { label: "Open performance", href: "/sales-partner/performance" },
      ]}
    />
  );
}
