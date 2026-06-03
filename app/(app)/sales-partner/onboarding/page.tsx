"use client";

import { CheckCircle2, Circle, FileCheck2, Upload } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import { salesPartnerApplications } from "@/data/sales-partners";

const steps = [
  "Company profile",
  "Countries",
  "Industries",
  "Categories",
  "Channels",
  "Customers",
  "Showroom",
  "Service",
  "Finance",
  "Documents",
  "Contract",
  "Approval",
];

const sectionData = [
  { title: "Company profile", fields: ["Legal name", "Registration number", "HQ city"] },
  { title: "Countries", fields: ["Primary market", "Secondary markets", "Territory owner"] },
  { title: "Industries", fields: ["Healthcare", "Hospitality", "Facility management"] },
  { title: "Categories", fields: ["Medical equipment", "Service robots", "Consumables"] },
  { title: "Channels", fields: ["Direct sales", "Dealer network", "Public tenders"] },
  { title: "Customers", fields: ["Top target accounts", "Current customer base", "Annual order frequency"] },
  { title: "Showroom", fields: ["Showroom location", "Demo capacity", "Availability slots"] },
  { title: "Service", fields: ["Installation team", "Maintenance response SLA", "Spare parts stock"] },
  { title: "Finance", fields: ["Credit insurance", "Leasing readiness", "Payment terms"] },
  { title: "Documents", fields: ["Tax certificate", "Insurance policy", "Compliance forms"] },
  { title: "Contract", fields: ["Commission model", "Exclusivity scope", "Signature workflow"] },
  { title: "Approval", fields: ["Regional review", "Legal sign-off", "Go-live date"] },
];

export default function SalesPartnerOnboardingPage() {
  const currentApplication = salesPartnerApplications[1];
  const completedSteps = currentApplication.step;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Partner Onboarding"
        description="Complete the 12-step onboarding workflow to unlock lead assignment, RFQ access, and commission payouts."
        action={
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Upload className="size-4" />
            Upload documents
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Progress" value={`${progress}%`} change={11} accent="blue" />
        <MetricCard label="Completed steps" value={`${completedSteps}/12`} accent="green" />
        <MetricCard label="Document status" value={currentApplication.documentStatus} accent="violet" />
        <MetricCard label="Approval status" value={currentApplication.approvalStatus} accent="slate" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="surface-card rounded-xl p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-900">Step progress</p>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const completed = index < completedSteps;
              const active = index === completedSteps;
              return (
                <div
                  key={step}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    {completed ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <Circle className="size-4 text-slate-400" />
                    )}
                    <span className={completed ? "text-slate-900" : "text-slate-600"}>{step}</span>
                  </div>
                  {active ? <StatusBadge variant="info">current</StatusBadge> : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 surface-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Form sections</p>
            <StatusBadge variant="warning">Review in progress</StatusBadge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {sectionData.map((section, index) => (
              <div key={section.title} className="rounded-lg border border-slate-100 p-4 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {index + 1}. {section.title}
                  </p>
                  {index < completedSteps ? (
                    <StatusBadge variant="success">completed</StatusBadge>
                  ) : (
                    <StatusBadge variant="default">pending</StatusBadge>
                  )}
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  {section.fields.map((field) => (
                    <li key={field}>- {field}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 flex items-start gap-2">
            <FileCheck2 className="size-4 mt-0.5 shrink-0" />
            Finance and documents are the last blockers before contract generation. Complete both sections to move to final approval.
          </div>
        </div>
      </div>
    </div>
  );
}
