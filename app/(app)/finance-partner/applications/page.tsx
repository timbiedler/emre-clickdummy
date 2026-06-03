"use client";

import { CircleCheckBig, Clock3, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { useCommerce } from "@/context/commerce-context";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/emre/status-badge";

export default function FinancePartnerApplicationsPage() {
  const { financeApplications } = useCommerce();

  const rows = [
    ...financeApplications.slice(0, 6).map((a) => ({
      cols: [a.id.toUpperCase(), a.customer, formatCurrency(a.amount), a.documentStatus],
    })),
    { cols: ["FIN-732", "Nordic Logistics Oy", "€220k", "approved"] },
    { cols: ["FIN-737", "Prime Mobility Hub", "€145k", "review"] },
  ];

  return (
    <div className="space-y-6">
      {financeApplications.length > 0 && (
        <div className="surface-card rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold">Applications from checkout (leasing/finance)</p>
          {financeApplications.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm">
              <div>
                <p className="font-medium">{a.productName}</p>
                <p className="text-xs text-slate-500">{a.customer} · {formatCurrency(a.monthlyRate)}/mo</p>
              </div>
              <StatusBadge variant="warning">{a.documentStatus}</StatusBadge>
              <button type="button" className="text-xs text-blue-600 hover:underline">Review</button>
            </div>
          ))}
        </div>
      )}
      <PortalDashboard
        title="Finance Applications"
        description="Process incoming credit applications with risk controls, KYC checks, and turn-around time monitoring."
        kpis={[
          { label: "Submitted this week", value: 41 + financeApplications.length, change: 9, icon: FileSpreadsheet, accent: "blue" },
          { label: "Auto-approved", value: 26, change: 5, icon: CircleCheckBig, accent: "green" },
          { label: "Manual review", value: 11 + financeApplications.length, change: -3, icon: ShieldAlert, accent: "violet" },
          { label: "Avg decision time", value: "1.7 days", change: -8, icon: Clock3, accent: "slate" },
        ]}
        tables={[
          {
            title: "Application queue",
            rows,
          },
        ]}
        actions={[{ label: "Back to finance dashboard", href: "/finance-partner" }]}
      />
    </div>
  );
}
