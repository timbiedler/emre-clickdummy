"use client";

import { BarChart4, CircleDollarSign, Funnel, Target } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { salesPartners } from "@/data/sales-partners";

const stages = [
  { name: "Qualification", deals: 19, value: "€1.1M", velocity: "11 days" },
  { name: "Demo scheduled", deals: 14, value: "€1.8M", velocity: "8 days" },
  { name: "Proposal sent", deals: 12, value: "€2.4M", velocity: "6 days" },
  { name: "Commercial review", deals: 9, value: "€1.5M", velocity: "5 days" },
  { name: "Negotiation", deals: 7, value: "€1.2M", velocity: "7 days" },
  { name: "Closing", deals: 5, value: "€0.9M", velocity: "4 days" },
];

export default function SalesPartnerPipelinePage() {
  const managedPipeline = salesPartners.slice(0, 6);

  return (
    <PortalDashboard
      title="Pipeline Stages"
      description="Monitor stage conversion quality and keep late-stage opportunities moving toward close."
      kpis={[
        { label: "Open opportunities", value: 66, change: 10, icon: Funnel, accent: "blue" },
        { label: "Weighted value", value: "€8.9M", change: 14, icon: CircleDollarSign, accent: "green" },
        { label: "Stage conversion", value: "41%", change: 3, icon: Target, accent: "violet" },
        { label: "Average cycle time", value: "28 days", change: -6, icon: BarChart4, accent: "slate" },
      ]}
      tables={[
        {
          title: "Pipeline by stage",
          rows: stages.map((stage) => ({
            cols: [stage.name, `${stage.deals} deals`, stage.value, stage.velocity, "approved"],
          })),
        },
        {
          title: "Largest partner opportunities",
          rows: managedPipeline.map((partner, index) => ({
            cols: [
              partner.name,
              `OPP-${900 + index}`,
              `€${Math.round(partner.pipelineValue / 1_000)}k`,
              index % 2 === 0 ? "review" : "approved",
            ],
          })),
        },
      ]}
      actions={[
        { label: "Open leads", href: "/sales-partner/leads" },
        { label: "Manage touchpoints", href: "/sales-partner/touchpoints" },
      ]}
    />
  );
}
