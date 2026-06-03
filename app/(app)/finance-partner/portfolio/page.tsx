"use client";

import { BarChart3, CalendarCheck2, ShieldCheck, Wallet } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function FinancePartnerPortfolioPage() {
  return (
    <PortalDashboard
      title="Portfolio Overview"
      description="Understand book quality, repayment behavior, and segment growth across active financing contracts."
      kpis={[
        { label: "Active contracts", value: 412, change: 6, icon: Wallet, accent: "blue" },
        { label: "On-time repayment", value: "97.4%", change: 2, icon: CalendarCheck2, accent: "green" },
        { label: "Delinquency ratio", value: "1.8%", change: -1, icon: ShieldCheck, accent: "violet" },
        { label: "Portfolio growth YoY", value: "22%", change: 5, icon: BarChart3, accent: "slate" },
      ]}
      tables={[
        {
          title: "Portfolio segments",
          rows: [
            { cols: ["Dealer financing", "€8.4M", "1.6% delinquency", "approved"] },
            { cols: ["Service contracts", "€2.1M", "2.3% delinquency", "approved"] },
            { cols: ["Enterprise bundles", "€6.7M", "1.9% delinquency", "review"] },
          ],
        },
      ]}
      actions={[{ label: "Back to finance dashboard", href: "/finance-partner" }]}
    />
  );
}
