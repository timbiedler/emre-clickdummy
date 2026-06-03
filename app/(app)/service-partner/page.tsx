"use client";

import { Boxes, ClipboardList, Gauge, Wrench } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function ServicePartnerDashboardPage() {
  return (
    <PortalDashboard
      title="Service Partner Dashboard"
      description="Coordinate field tickets, service requests, and spare part logistics with strict SLA visibility."
      kpis={[
        { label: "Open tickets", value: 74, change: -6, icon: ClipboardList, accent: "blue" },
        { label: "Service requests today", value: 22, change: 5, icon: Wrench, accent: "green" },
        { label: "Spare parts ready", value: "92%", change: 2, icon: Boxes, accent: "violet" },
        { label: "SLA score", value: "95/100", change: 4, icon: Gauge, accent: "slate" },
      ]}
      actions={[
        { label: "Open tickets board", href: "/service-partner/tickets" },
        { label: "Manage requests", href: "/service-partner/requests" },
        { label: "Check spare parts", href: "/service-partner/spare-parts" },
        { label: "View performance", href: "/service-partner/performance" },
      ]}
      tables={[
        {
          title: "Regional service health",
          rows: [
            { cols: ["DACH", "96% SLA", "14 open tickets", "approved"] },
            { cols: ["Benelux", "94% SLA", "19 open tickets", "approved"] },
            { cols: ["Nordics", "89% SLA", "11 open tickets", "review"] },
          ],
        },
      ]}
    />
  );
}
