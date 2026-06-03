"use client";

import { Gauge, Medal, Timer, Wrench } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function ServicePartnerPerformancePage() {
  return (
    <PortalDashboard
      title="Service Performance"
      description="Measure first-time fix quality, SLA adherence, and technician utilization by service region."
      kpis={[
        { label: "Service score", value: "91/100", change: 5, icon: Gauge, accent: "blue" },
        { label: "First-time fix rate", value: "88%", change: 4, icon: Wrench, accent: "green" },
        { label: "Avg resolution time", value: "19h", change: -6, icon: Timer, accent: "violet" },
        { label: "Regional rank", value: "Top 3", change: 1, icon: Medal, accent: "slate" },
      ]}
      tables={[
        {
          title: "Region performance snapshot",
          rows: [
            { cols: ["DACH", "92 score", "89% first-time fix", "approved"] },
            { cols: ["Benelux", "90 score", "87% first-time fix", "approved"] },
            { cols: ["Nordics", "85 score", "81% first-time fix", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to service dashboard", href: "/service-partner" }]}
    />
  );
}
