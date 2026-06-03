"use client";

import { BriefcaseBusiness, CarFront, ClipboardCheck, Coins } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function DealerDashboardPage() {
  return (
    <PortalDashboard
      title="Dealer Dashboard"
      description="Monitor inbound leads, active campaigns, and showroom performance across your dealer network."
      kpis={[
        { label: "Assigned leads", value: 142, change: 8, icon: BriefcaseBusiness, accent: "blue" },
        { label: "Open test-drive requests", value: 31, change: 6, icon: CarFront, accent: "green" },
        { label: "Campaign compliance", value: "96%", change: 3, icon: ClipboardCheck, accent: "violet" },
        { label: "Expected monthly gross", value: "€1.4M", change: 11, icon: Coins, accent: "slate" },
      ]}
      actions={[
        { label: "Open lead queue", href: "/dealer/leads" },
        { label: "Manage campaigns", href: "/dealer/campaigns" },
        { label: "Review performance", href: "/dealer/performance" },
      ]}
      tables={[
        {
          title: "Top dealers this week",
          rows: [
            { cols: ["Metro Auto Group", "38 leads", "22 deals won", "approved"] },
            { cols: ["Prime Mobility Hub", "27 leads", "17 deals won", "approved"] },
            { cols: ["Northline Dealer AG", "21 leads", "11 deals won", "review"] },
          ],
        },
      ]}
    />
  );
}
