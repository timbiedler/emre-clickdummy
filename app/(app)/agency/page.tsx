"use client";

import { Activity, BadgePercent, Megaphone, UsersRound } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function AgencyDashboardPage() {
  return (
    <PortalDashboard
      title="Agency Dashboard"
      description="Coordinate campaign delivery, inbound lead quality, and channel performance for managed accounts."
      kpis={[
        { label: "Active briefs", value: 24, change: 10, icon: Megaphone, accent: "blue" },
        { label: "Qualified leads", value: 912, change: 14, icon: UsersRound, accent: "green" },
        { label: "Average CTR", value: "4.7%", change: 6, icon: BadgePercent, accent: "violet" },
        { label: "Channel health", value: "Green", change: 0, icon: Activity, accent: "slate" },
      ]}
      actions={[
        { label: "Open campaigns", href: "/agency/campaigns" },
        { label: "Review leads", href: "/agency/leads" },
        { label: "Check performance", href: "/agency/performance" },
      ]}
      tables={[
        {
          title: "Client account pulse",
          rows: [
            { cols: ["Metro Auto Group", "5 live campaigns", "188 MQLs", "approved"] },
            { cols: ["Careline Clinics", "3 live campaigns", "142 MQLs", "approved"] },
            { cols: ["Northline Dealer AG", "2 live campaigns", "87 MQLs", "review"] },
          ],
        },
      ]}
    />
  );
}
