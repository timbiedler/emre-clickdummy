"use client";

import { Award, Clock4, Gauge, Medal } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { salesPartners } from "@/data/sales-partners";

export default function SalesPartnerPerformancePage() {
  const sortedPartners = [...salesPartners].sort((a, b) => b.performanceScore - a.performanceScore);

  return (
    <PortalDashboard
      title="Performance Metrics"
      description="Benchmark partner delivery quality across conversion rates, cycle times, and territory growth contribution."
      kpis={[
        { label: "Average score", value: "84/100", change: 6, icon: Gauge, accent: "blue" },
        { label: "Top tier partners", value: 9, change: 2, icon: Award, accent: "green" },
        { label: "On-time follow-up", value: "93%", change: 5, icon: Clock4, accent: "violet" },
        { label: "Quarterly ranking", value: "A2", change: 1, icon: Medal, accent: "slate" },
      ]}
      tables={[
        {
          title: "Partner leaderboard",
          rows: sortedPartners.slice(0, 10).map((partner, index) => ({
            cols: [
              `#${index + 1}`,
              partner.name,
              `${partner.performanceScore}/100`,
              `${Math.round(partner.pipelineValue / 1_000)}k pipeline`,
              "approved",
            ],
          })),
        },
      ]}
      actions={[
        { label: "Back to dashboard", href: "/sales-partner" },
        { label: "Open commissions", href: "/sales-partner/commissions" },
      ]}
    />
  );
}
