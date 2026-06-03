"use client";

import { BanknoteArrowDown, FileCheck, Landmark, PieChart } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function FinancePartnerDashboardPage() {
  return (
    <PortalDashboard
      title="Finance Partner Dashboard"
      description="Track financing applications, portfolio quality, and payout readiness across active partner channels."
      kpis={[
        { label: "Open applications", value: 63, change: 7, icon: FileCheck, accent: "blue" },
        { label: "Approved credit volume", value: "€5.6M", change: 12, icon: Landmark, accent: "green" },
        { label: "Portfolio at risk", value: "2.1%", change: -1, icon: PieChart, accent: "violet" },
        { label: "Pending disbursement", value: "€1.3M", change: 4, icon: BanknoteArrowDown, accent: "slate" },
      ]}
      actions={[
        { label: "Open applications", href: "/finance-partner/applications" },
        { label: "Review portfolio", href: "/finance-partner/portfolio" },
      ]}
      tables={[
        {
          title: "Daily finance summary",
          rows: [
            { cols: ["Dealer installment plans", "18 files", "€1.1M requested", "approved"] },
            { cols: ["Service contract leasing", "9 files", "€420k requested", "review"] },
            { cols: ["Enterprise equipment finance", "6 files", "€1.9M requested", "approved"] },
          ],
        },
      ]}
    />
  );
}
