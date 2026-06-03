"use client";

import { Boxes, CircleCheckBig, PackageSearch, Truck } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function ServicePartnerSparePartsPage() {
  return (
    <PortalDashboard
      title="Spare Parts"
      description="Track stock depth, critical part coverage, and replenishment speed for regional service hubs."
      kpis={[
        { label: "Stocked SKUs", value: 412, change: 3, icon: Boxes, accent: "blue" },
        { label: "Critical parts coverage", value: "97%", change: 2, icon: CircleCheckBig, accent: "green" },
        { label: "Backordered parts", value: 11, change: -4, icon: PackageSearch, accent: "violet" },
        { label: "Avg replenishment", value: "2.8 days", change: -7, icon: Truck, accent: "slate" },
      ]}
      tables={[
        {
          title: "Part availability",
          rows: [
            { cols: ["SP-4402 Drive Module", "DACH Hub", "48 in stock", "approved"] },
            { cols: ["SP-1877 Sensor Kit", "Benelux Hub", "12 in stock", "review"] },
            { cols: ["SP-9831 Power Unit", "Nordics Hub", "21 in stock", "approved"] },
          ],
        },
      ]}
      actions={[{ label: "Back to service dashboard", href: "/service-partner" }]}
    />
  );
}
