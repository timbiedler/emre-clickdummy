"use client";

import { useApp } from "@/context/app-context";
import { StatusBadge } from "./status-badge";
import { Building2, MapPin, CreditCard } from "lucide-react";
import { companies } from "@/data/users";

export function IndustryProfileCard() {
  const { industry, workspaceCountry, companyType, role } = useApp();
  const company = companies.find((c) => c.primaryIndustry === industry) ?? companies[0];

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Industry profile
          </p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{industry}</p>
        </div>
        <StatusBadge variant="info">{companyType}</StatusBadge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Building2 className="size-4 text-slate-400" />
          {company.companySize} employees
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="size-4 text-slate-400" />
          {workspaceCountry}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <CreditCard className="size-4 text-slate-400" />
          Finance: {company.financeStatus.replace(/_/g, " ")}
        </div>
        <div className="text-slate-600">
          {company.activeRfqs} active RFQs · {company.openOrders} open orders
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {company.preferredCategories.map((c) => (
          <StatusBadge key={c}>{c}</StatusBadge>
        ))}
      </div>
      {role === "customer" && (
        <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
          Recommendations prioritize {industry.toLowerCase()} — full marketplace remains available.
        </p>
      )}
    </div>
  );
}
