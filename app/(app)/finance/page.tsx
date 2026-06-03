"use client";

import Link from "next/link";
import {
  CreditCard,
  Calculator,
  Upload,
  TrendingUp,
  FileWarning,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { FinanceCalculator } from "@/components/emre/finance-calculator";
import { FinanceReadinessScore } from "@/components/emre/data-room-upload-card";
import { MetricCard } from "@/components/emre/metric-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { financeApplications } from "@/data/finance";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusVariant = {
  documents_missing: "danger" as const,
  under_review: "warning" as const,
  pre_approved: "info" as const,
  offer_ready: "success" as const,
};

const statusLabel = {
  documents_missing: "Documents Missing",
  under_review: "Under Review",
  pre_approved: "Pre-approved",
  offer_ready: "Offer Ready",
};

const financeModes = [
  { mode: "Buy now", desc: "Direct purchase with volume tiers" },
  { mode: "Lease", desc: "36–60 month operating lease" },
  { mode: "Rent-to-own", desc: "Robotics fleet with ownership transfer" },
  { mode: "Finetrading", desc: "Working capital for B2B procurement" },
  { mode: "Subscription", desc: "Consumables & service bundles" },
];

const partnerOffers = [
  { partner: "LeaseLine Europe", rate: "4.2% APR", type: "Leasing", status: "pre_approved" },
  { partner: "TradeCap Partners", rate: "Finetrading line €500k", type: "Finetrading", status: "under_review" },
  { partner: "FleetLease DACH", rate: "From €890/mo", type: "Rent-to-own", status: "offer_ready" },
];

export default function FinancePage() {
  const { vertical } = useApp();
  const apps = financeApplications.filter((f) => f.vertical === vertical);
  const preApproved = apps.filter((a) => a.status === "pre_approved" || a.status === "offer_ready").length;
  const missingDocs = apps.filter((a) => a.status === "documents_missing").length;
  const avgMonthly = apps.length
    ? Math.round(apps.reduce((s, a) => s + a.monthlyRate, 0) / apps.length)
    : 890;

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="finance.title"
        descriptionKey="finance.subtitle"
        action={
          <Link href="/data-room">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500">
              <Upload className="size-4" /> Data Room
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Leasing Requests" value={apps.length + 12} change={18.4} accent="green" />
        <MetricCard label="Pre-approved" value={preApproved} change={11.2} accent="blue" />
        <MetricCard label="Documents Missing" value={missingDocs} accent="violet" />
        <MetricCard label="Avg. Monthly Lease" value={formatCurrency(avgMonthly)} change={5.8} accent="blue" />
      </div>

      <Tabs defaultValue="calculator">
        <TabsList className="surface-card border-slate-200 flex-wrap h-auto">
          <TabsTrigger value="calculator">Calculators</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="partners">Finance Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <FinanceCalculator defaultPrice={vertical === "medical" ? 45000 : 89000} />
            <div className="space-y-4">
              <FinanceReadinessScore score={72} />
              <div className="surface-card rounded-xl p-5 space-y-3">
                <h3 className="font-semibold">Finance Product Modes</h3>
                {financeModes.map((fm) => (
                  <div
                    key={fm.mode}
                    className="surface-card rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{fm.mode}</p>
                      <p className="text-xs text-muted-foreground">{fm.desc}</p>
                    </div>
                    <StatusBadge variant="success">Available</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <div key={app.id} className="surface-card rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{app.company}</p>
                    <p className="text-xs text-muted-foreground">{app.product}</p>
                  </div>
                  <StatusBadge variant={statusVariant[app.status]}>
                    {statusLabel[app.status]}
                  </StatusBadge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-semibold text-accent-blue">{formatCurrency(app.amount)}</p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                  <div>
                    <p className="font-semibold">{app.termMonths}mo</p>
                    <p className="text-xs text-muted-foreground">Term</p>
                  </div>
                  <div>
                    <p className="font-semibold text-accent-green">{formatCurrency(app.monthlyRate)}</p>
                    <p className="text-xs text-muted-foreground">/ month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Document score: {app.documentScore}%
                  </span>
                  <span className="capitalize">{app.type}</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/data-room" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Upload className="size-3" /> Documents
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Calculator className="size-3" /> Recalculate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4 space-y-3">
          {[
            { stage: "Documents Missing", count: missingDocs, icon: FileWarning, variant: "danger" as const },
            { stage: "Under Review", count: apps.filter((a) => a.status === "under_review").length, icon: CreditCard, variant: "warning" as const },
            { stage: "Pre-approved", count: preApproved, icon: CheckCircle2, variant: "info" as const },
            { stage: "Offer Ready", count: apps.filter((a) => a.status === "offer_ready").length, icon: TrendingUp, variant: "success" as const },
          ].map((s) => (
            <div
              key={s.stage}
              className="surface-card rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <s.icon className="size-5 text-blue-600" />
                <span className="font-medium">{s.stage}</span>
              </div>
              <StatusBadge variant={s.variant}>{s.count} applications</StatusBadge>
            </div>
          ))}
          <div className="surface-card rounded-xl p-4 flex items-center gap-3">
            <Sparkles className="size-5 text-violet-600" />
            <div>
              <p className="text-sm font-medium">Finance conversion rate</p>
              <p className="text-2xl font-bold text-accent-green">78%</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-4 grid md:grid-cols-3 gap-4">
          {partnerOffers.map((po) => (
            <div key={po.partner} className="surface-card rounded-xl p-4 space-y-2">
              <p className="font-medium">{po.partner}</p>
              <p className="text-sm text-accent-blue">{po.rate}</p>
              <StatusBadge variant="violet">{po.type}</StatusBadge>
              <StatusBadge variant={statusVariant[po.status as keyof typeof statusVariant]}>
                {statusLabel[po.status as keyof typeof statusLabel]}
              </StatusBadge>
              <Button size="sm" className="w-full mt-2">
                View Offer
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
