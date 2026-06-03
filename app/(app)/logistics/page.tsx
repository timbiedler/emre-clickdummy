"use client";

import { Boxes, RefreshCcw, Truck, Warehouse } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function LogisticsDashboardPage() {
  return (
    <PortalDashboard
      title="Logistics Dashboard"
      description="Manage inventory, shipment execution, and return processing across regional distribution hubs."
      kpis={[
        { label: "Warehouse utilization", value: "81%", change: 4, icon: Warehouse, accent: "blue" },
        { label: "Stocked units", value: "34,200", change: 6, icon: Boxes, accent: "green" },
        { label: "Shipments in transit", value: 147, change: 9, icon: Truck, accent: "violet" },
        { label: "Return processing", value: "92% in SLA", change: 3, icon: RefreshCcw, accent: "slate" },
      ]}
      actions={[
        { label: "Open stock", href: "/logistics/stock" },
        { label: "Track shipments", href: "/logistics/shipments" },
        { label: "Manage returns", href: "/logistics/returns" },
      ]}
      tables={[
        {
          title: "Regional logistics pulse",
          rows: [
            { cols: ["DACH Hub", "95% dispatch SLA", "42 trucks active", "approved"] },
            { cols: ["Benelux Hub", "93% dispatch SLA", "31 trucks active", "approved"] },
            { cols: ["Nordics Hub", "87% dispatch SLA", "18 trucks active", "review"] },
          ],
        },
      ]}
    />
  );
}
