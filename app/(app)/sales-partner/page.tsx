"use client";

import {
  Banknote,
  ClipboardList,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { salesPartners } from "@/data/sales-partners";

export default function SalesPartnerDashboardPage() {
  const totalAssignedLeads = salesPartners.reduce((sum, partner) => sum + partner.assignedLeads, 0);
  const totalPipelineValue = salesPartners.reduce((sum, partner) => sum + partner.pipelineValue, 0);
  const openRfqs = 27;
  const pendingCommissions = 14;
  const pipelineInMillions = (totalPipelineValue / 1_000_000).toFixed(1);

  return (
    <PortalDashboard
      title="Sales Partner Dashboard"
      description="Track lead delivery, active pipeline, RFQ handling, and commission settlements across your partner network."
      kpis={[
        {
          label: "Assigned leads",
          value: totalAssignedLeads.toLocaleString(),
          change: 9,
          icon: UserPlus,
          accent: "blue",
        },
        {
          label: "Pipeline value",
          value: `€${pipelineInMillions}M`,
          change: 13,
          icon: TrendingUp,
          accent: "green",
        },
        {
          label: "Open RFQs",
          value: openRfqs,
          change: 4,
          icon: ClipboardList,
          accent: "violet",
        },
        {
          label: "Pending commissions",
          value: pendingCommissions,
          change: -3,
          icon: Banknote,
          accent: "slate",
        },
      ]}
      actions={[
        { label: "Continue onboarding", href: "/sales-partner/onboarding" },
        { label: "Review assigned leads", href: "/sales-partner/leads" },
        { label: "Check pipeline stages", href: "/sales-partner/pipeline" },
        { label: "Open touchpoint campaigns", href: "/sales-partner/touchpoints" },
        { label: "Process commissions", href: "/sales-partner/commissions" },
        { label: "Open performance report", href: "/sales-partner/performance" },
      ]}
      tables={[
        {
          title: "Top partner accounts this week",
          rows: salesPartners.slice(0, 6).map((partner) => ({
            cols: [
              partner.name,
              `${partner.assignedLeads} leads`,
              `€${Math.round(partner.pipelineValue / 1_000)}k`,
              `${partner.performanceScore}/100`,
            ],
          })),
        },
        {
          title: "Action queue",
          rows: [
            { cols: ["DACH hospital bundle RFQ", "12 Jun", "High value", "review"] },
            { cols: ["Benelux dealer contract addendum", "14 Jun", "Legal", "review"] },
            { cols: ["Nordics quarterly commission file", "16 Jun", "Finance", "approved"] },
          ],
        },
      ]}
      actionButton={{ label: "Create partner task", href: "/sales-partner/leads" }}
    />
  );
}
