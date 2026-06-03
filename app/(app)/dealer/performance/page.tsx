"use client";

import { Gauge, Medal, PackageCheck, Timer } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function DealerPerformancePage() {
  return (
    <PortalDashboard
      title="Dealer Performance"
      description="Track conversion quality, delivery SLAs, and sales velocity for each dealer group."
      kpis={[
        { label: "Network score", value: "88/100", change: 4, icon: Gauge, accent: "blue" },
        { label: "Top-tier dealers", value: 12, change: 3, icon: Medal, accent: "green" },
        { label: "Orders delivered on-time", value: "94%", change: 2, icon: PackageCheck, accent: "violet" },
        { label: "Avg. deal cycle", value: "19 days", change: -4, icon: Timer, accent: "slate" },
      ]}
      tables={[
        {
          title: "Dealer leaderboard",
          rows: [
            { cols: ["Metro Auto Group", "91 score", "39% close rate", "approved"] },
            { cols: ["Prime Mobility Hub", "89 score", "36% close rate", "approved"] },
            { cols: ["Northline Dealer AG", "82 score", "31% close rate", "review"] },
            { cols: ["Alpine Drive Center", "80 score", "29% close rate", "review"] },
          ],
        },
      ]}
      actions={[
        { label: "Back to dealer dashboard", href: "/dealer" },
      ]}
    />
  );
}
