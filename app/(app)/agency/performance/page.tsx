"use client";

import { Gauge, Medal, TrendingUp, UsersRound } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function AgencyPerformancePage() {
  return (
    <PortalDashboard
      title="Agency Performance"
      description="Benchmark campaign impact, cost efficiency, and sales contribution across account portfolios."
      kpis={[
        { label: "Agency score", value: "90/100", change: 5, icon: Gauge, accent: "blue" },
        { label: "Pipeline influenced", value: "€9.8M", change: 16, icon: TrendingUp, accent: "green" },
        { label: "MQL to SQL rate", value: "46%", change: 4, icon: UsersRound, accent: "violet" },
        { label: "Client retention", value: "98%", change: 1, icon: Medal, accent: "slate" },
      ]}
      tables={[
        {
          title: "Performance by account",
          rows: [
            { cols: ["Metro Auto Group", "92 score", "€3.2M influenced", "approved"] },
            { cols: ["Careline Clinics", "89 score", "€2.7M influenced", "approved"] },
            { cols: ["Northline Dealer AG", "82 score", "€1.4M influenced", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to agency dashboard", href: "/agency" }]}
    />
  );
}
