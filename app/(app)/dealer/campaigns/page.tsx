"use client";

import { Megaphone, ScanLine, Target, TrendingUp } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function DealerCampaignsPage() {
  return (
    <PortalDashboard
      title="Dealer Campaigns"
      description="Evaluate local campaign execution and optimize spend-to-lead efficiency by region and channel."
      kpis={[
        { label: "Active campaigns", value: 16, change: 7, icon: Megaphone, accent: "blue" },
        { label: "Qualified responses", value: 584, change: 10, icon: Target, accent: "green" },
        { label: "QR activations", value: "4,112", change: 6, icon: ScanLine, accent: "violet" },
        { label: "Avg. ROI", value: "3.8x", change: 5, icon: TrendingUp, accent: "slate" },
      ]}
      tables={[
        {
          title: "Campaign stage board",
          rows: [
            { cols: ["Summer Fleet Roadshow", "Live", "€72k budget", "approved"] },
            { cols: ["Hospitality Demo Days", "Creative review", "€41k budget", "review"] },
            { cols: ["Service Contract Drive", "Planning", "€28k budget", "review"] },
          ],
        },
      ]}
      actions={[
        { label: "Back to dashboard", href: "/dealer" },
        { label: "Open performance", href: "/dealer/performance" },
      ]}
    />
  );
}
