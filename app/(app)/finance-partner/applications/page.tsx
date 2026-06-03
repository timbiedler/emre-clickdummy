"use client";

import { CircleCheckBig, Clock3, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function FinancePartnerApplicationsPage() {
  return (
    <PortalDashboard
      title="Finance Applications"
      description="Process incoming credit applications with risk controls, KYC checks, and turn-around time monitoring."
      kpis={[
        { label: "Submitted this week", value: 41, change: 9, icon: FileSpreadsheet, accent: "blue" },
        { label: "Auto-approved", value: 26, change: 5, icon: CircleCheckBig, accent: "green" },
        { label: "Manual review", value: 11, change: -3, icon: ShieldAlert, accent: "violet" },
        { label: "Avg decision time", value: "1.7 days", change: -8, icon: Clock3, accent: "slate" },
      ]}
      tables={[
        {
          title: "Application queue",
          rows: [
            { cols: ["FIN-732", "Nordic Logistics Oy", "€220k", "approved"] },
            { cols: ["FIN-737", "Prime Mobility Hub", "€145k", "review"] },
            { cols: ["FIN-742", "Careline Clinics", "€310k", "review"] },
            { cols: ["FIN-744", "Metro Auto Group", "€95k", "approved"] },
          ],
        },
      ]}
      actions={[{ label: "Back to finance dashboard", href: "/finance-partner" }]}
    />
  );
}
