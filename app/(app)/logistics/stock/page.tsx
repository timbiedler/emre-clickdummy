"use client";

import { Boxes, CircleAlert, PackagePlus, Warehouse } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function LogisticsStockPage() {
  return (
    <PortalDashboard
      title="Stock Management"
      description="Keep high-turn SKUs available, control buffer stock, and trigger timely replenishment cycles."
      kpis={[
        { label: "SKUs monitored", value: 1280, change: 3, icon: Boxes, accent: "blue" },
        { label: "Low-stock alerts", value: 37, change: -8, icon: CircleAlert, accent: "green" },
        { label: "Inbound restocks", value: 19, change: 5, icon: PackagePlus, accent: "violet" },
        { label: "Hub capacity", value: "84%", change: 2, icon: Warehouse, accent: "slate" },
      ]}
      tables={[
        {
          title: "Critical stock lines",
          rows: [
            { cols: ["Medical Sensor Module", "Reorder in 2 days", "DACH Hub", "review"] },
            { cols: ["Drive Motor Pack", "Healthy stock", "Benelux Hub", "approved"] },
            { cols: ["NFC Touchpoint Kits", "Reorder in 5 days", "Nordics Hub", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to logistics dashboard", href: "/logistics" }]}
    />
  );
}
