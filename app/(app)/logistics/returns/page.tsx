"use client";

import { CircleCheckBig, RefreshCcw, ShieldCheck, Undo2 } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function LogisticsReturnsPage() {
  return (
    <PortalDashboard
      title="Returns"
      description="Handle return authorizations, inspection throughput, and credit-note processing without SLA drift."
      kpis={[
        { label: "Open return cases", value: 28, change: -3, icon: Undo2, accent: "blue" },
        { label: "Inspected in 48h", value: "91%", change: 4, icon: ShieldCheck, accent: "green" },
        { label: "Restock eligible", value: "73%", change: 2, icon: CircleCheckBig, accent: "violet" },
        { label: "Avg. cycle time", value: "4.1 days", change: -7, icon: RefreshCcw, accent: "slate" },
      ]}
      tables={[
        {
          title: "Return queue",
          rows: [
            { cols: ["RET-701", "Packaging damage", "Inspection scheduled", "review"] },
            { cols: ["RET-704", "Wrong configuration", "Credit approved", "approved"] },
            { cols: ["RET-709", "Transit dent", "Warehouse review", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to logistics dashboard", href: "/logistics" }]}
    />
  );
}
