"use client";

import { Clock3, Route, ScanLine, Truck } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function LogisticsShipmentsPage() {
  return (
    <PortalDashboard
      title="Shipments"
      description="Track shipment status, route delays, and scan compliance for outbound logistics execution."
      kpis={[
        { label: "Shipments this week", value: 382, change: 11, icon: Truck, accent: "blue" },
        { label: "On-time departures", value: "95%", change: 3, icon: Clock3, accent: "green" },
        { label: "Route exceptions", value: 14, change: -5, icon: Route, accent: "violet" },
        { label: "Scan compliance", value: "98%", change: 1, icon: ScanLine, accent: "slate" },
      ]}
      tables={[
        {
          title: "Shipment monitor",
          rows: [
            { cols: ["SHP-5401", "Berlin -> Vienna", "In transit", "approved"] },
            { cols: ["SHP-5408", "Rotterdam -> Paris", "Delayed 4h", "review"] },
            { cols: ["SHP-5412", "Oslo -> Stockholm", "Out for delivery", "approved"] },
          ],
        },
      ]}
      actions={[{ label: "Back to logistics dashboard", href: "/logistics" }]}
    />
  );
}
