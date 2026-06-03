"use client";

import { AlertTriangle, ClipboardClock, ShieldCheck, Ticket } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function ServicePartnerTicketsPage() {
  return (
    <PortalDashboard
      title="Service Tickets"
      description="Prioritize critical incidents and keep first-response and resolution targets on track."
      kpis={[
        { label: "Critical tickets", value: 9, change: -2, icon: AlertTriangle, accent: "blue" },
        { label: "Total open", value: 74, change: -6, icon: Ticket, accent: "green" },
        { label: "Resolved in 24h", value: "81%", change: 7, icon: ShieldCheck, accent: "violet" },
        { label: "Average first response", value: "43 min", change: -8, icon: ClipboardClock, accent: "slate" },
      ]}
      tables={[
        {
          title: "Ticket queue",
          rows: [
            { cols: ["TK-1192", "Compressor fault - Berlin", "Critical", "review"] },
            { cols: ["TK-1195", "Firmware update - Lyon", "Medium", "approved"] },
            { cols: ["TK-1198", "Sensor replacement - Oslo", "High", "review"] },
            { cols: ["TK-1201", "Calibration check - Vienna", "Low", "approved"] },
          ],
        },
      ]}
      actions={[{ label: "Back to service dashboard", href: "/service-partner" }]}
    />
  );
}
