"use client";

import { Eye, Megaphone, Route, ScanSearch } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function AgencyCampaignsPage() {
  return (
    <PortalDashboard
      title="Agency Campaigns"
      description="Manage campaign flighting, creative approvals, and response tracking across all active channels."
      kpis={[
        { label: "Campaigns in flight", value: 18, change: 8, icon: Megaphone, accent: "blue" },
        { label: "Impressions", value: "2.7M", change: 11, icon: Eye, accent: "green" },
        { label: "Attribution confidence", value: "93%", change: 3, icon: Route, accent: "violet" },
        { label: "Creative reviews", value: 6, change: -2, icon: ScanSearch, accent: "slate" },
      ]}
      tables={[
        {
          title: "Campaign execution",
          rows: [
            { cols: ["DACH Growth Sprint", "Paid Social", "Week 3/4", "approved"] },
            { cols: ["Benelux Showroom Launch", "Search + Display", "Creative review", "review"] },
            { cols: ["Nordics Service Retention", "Email + CRM", "Week 1/6", "approved"] },
          ],
        },
      ]}
      actions={[{ label: "Back to agency dashboard", href: "/agency" }]}
    />
  );
}
