"use client";

import { Gauge, PackageCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function SupplierPerformancePage() {
  return (
    <PortalDashboard
      title="Supplier Performance"
      description="Track supplier delivery consistency, quality yields, and growth impact across active catalog lines."
      kpis={[
        { label: "Supplier quality score", value: "93/100", change: 3, icon: Gauge, accent: "blue" },
        { label: "On-time fulfillment", value: "96%", change: 2, icon: PackageCheck, accent: "green" },
        { label: "Compliance pass rate", value: "98%", change: 1, icon: ShieldCheck, accent: "violet" },
        { label: "Revenue contribution", value: "€12.4M", change: 14, icon: TrendingUp, accent: "slate" },
      ]}
      tables={[
        {
          title: "Supplier scorecard",
          rows: [
            { cols: ["MedEquip Core", "95 score", "98% on-time", "approved"] },
            { cols: ["RoboServe Components", "92 score", "95% on-time", "approved"] },
            { cols: ["CleanTech Supplies", "86 score", "89% on-time", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to supplier portal", href: "/supplier" }]}
    />
  );
}
