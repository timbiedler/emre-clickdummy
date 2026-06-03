"use client";

import { useState } from "react";
import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { MetricCard } from "@/components/emre/metric-card";
import {
  salesPartnerApplications,
  salesPartners,
  commissionModels,
} from "@/data/sales-partners";
import { Handshake, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SalesPartnerApplication } from "@/data/types";

export default function AdminSalesPartnersPage() {
  const [selected, setSelected] = useState<SalesPartnerApplication | null>(null);
  const pending = salesPartnerApplications.filter(
    (a) => a.approvalStatus === "pending" || a.approvalStatus === "review"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Partner Onboarding"
        description="Review applications, assign regions, industries, product categories, and commission models."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Partners" value={salesPartners.length} icon={Handshake} accent="green" />
        <MetricCard label="Pending Review" value={pending.length} icon={Handshake} accent="violet" />
        <MetricCard label="Territories" value={15} icon={MapPin} accent="blue" />
        <MetricCard label="Commission Models" value={commissionModels.length} icon={CreditCard} accent="slate" />
      </div>

      <div className="surface-card overflow-hidden">
        <p className="text-sm font-semibold px-5 pt-5 pb-3">Onboarding applications</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-5 py-2">Company</th>
              <th className="px-5 py-2">Countries</th>
              <th className="px-5 py-2">Industries</th>
              <th className="px-5 py-2">Step</th>
              <th className="px-5 py-2">Documents</th>
              <th className="px-5 py-2">Status</th>
              <th className="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {salesPartnerApplications.map((app) => (
              <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-medium">{app.companyName}</td>
                <td className="px-5 py-3 text-xs">{app.countries.join(", ")}</td>
                <td className="px-5 py-3 text-xs">{app.industries.join(", ")}</td>
                <td className="px-5 py-3">{app.step}/12</td>
                <td className="px-5 py-3">
                  <StatusBadge variant={app.documentStatus === "complete" ? "success" : "warning"}>
                    {app.documentStatus}
                  </StatusBadge>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge variant={app.approvalStatus === "approved" ? "success" : "info"}>
                    {app.approvalStatus}
                  </StatusBadge>
                </td>
                <td className="px-5 py-3">
                  <Button size="sm" variant="outline" onClick={() => setSelected(app)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="surface-card-elevated overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.companyName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <p><span className="text-slate-500">Contact:</span> {selected.contactName}</p>
                <p><span className="text-slate-500">Email:</span> {selected.email}</p>
                <p><span className="text-slate-500">Categories:</span> {selected.categories.join(", ")}</p>
                <p><span className="text-slate-500">Finance readiness:</span> {selected.financeReadiness}</p>
                <p><span className="text-slate-500">Showroom:</span> {selected.showroomAvailable ? "Yes" : "No"}</p>
                <div className="flex gap-2 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">Approve partner</Button>
                  <Button variant="outline">Assign regions</Button>
                  <Button variant="outline">Reject</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
