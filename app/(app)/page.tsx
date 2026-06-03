"use client";

import {
  FileText,
  Package,
  CreditCard,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { ActivityFeed } from "@/components/emre/activity-feed";
import { FlowDiagram } from "@/components/emre/flow-diagram";
import { RFQCard } from "@/components/emre/rfq-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { adminActivities } from "@/data/admin-metrics";
import { rfqs, orders, financeApplications } from "@/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", rfqs: 120, orders: 85 },
  { month: "Feb", rfqs: 145, orders: 92 },
  { month: "Mar", rfqs: 168, orders: 110 },
  { month: "Apr", rfqs: 190, orders: 125 },
  { month: "May", rfqs: 210, orders: 148 },
  { month: "Jun", rfqs: 234, orders: 167 },
];

export default function CommandCenterPage() {
  const { vertical } = useApp();
  const verticalRfqs = rfqs.filter(
    (r) => r.vertical === vertical && r.status !== "closed"
  ).slice(0, 3);
  const verticalOrders = orders.filter((o) => o.vertical === vertical);
  const inTransit = verticalOrders.filter(
    (o) => o.status === "shipped" || o.status === "partial"
  ).length;
  const financeApps = financeApplications.filter((f) => f.vertical === vertical);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Operational overview of RFQs, orders, finance pipeline, and procurement activity."
        action={
          <Link href="/assistant">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Sparkles className="size-4" /> AI Need Assistant
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="AI Consultations" value={47} change={22.1} icon={Sparkles} accent="violet" />
        <MetricCard label="Leasing Pipeline" value={financeApps.length + 8} change={18.6} icon={CreditCard} accent="green" />
        <MetricCard label="Finance Readiness" value="72%" change={5.4} icon={CreditCard} accent="blue" />
        <MetricCard label="AI-generated RFQs" value={34} change={15.2} icon={FileText} accent="blue" />
        <MetricCard label="Leasing Demand Top SKU" value={vertical === "medical" ? "PPE" : "Clean Bot"} icon={TrendingUp} accent="violet" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active RFQs" value={verticalRfqs.length + 12} change={14.2} icon={FileText} accent="blue" />
        <MetricCard label="Open Offers" value={28} change={8.5} icon={TrendingUp} accent="violet" />
        <MetricCard label="Orders in Transit" value={inTransit} icon={Package} accent="green" />
        <MetricCard label="Finance Pipeline" value={financeApps.length} change={11.3} icon={CreditCard} accent="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card rounded-xl p-5">
          <p className="text-sm font-medium text-slate-900 mb-4">Platform activity</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rfqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="rfqs" stroke="#2563eb" fill="url(#rfqGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="orders" stroke="#16a34a" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <FlowDiagram />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Active RFQs</p>
            <Link href="/rfq" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {verticalRfqs.map((rfq) => (
              <RFQCard key={rfq.id} rfq={rfq} onClick={() => {}} />
            ))}
          </div>
        </div>
        <ActivityFeed items={adminActivities.slice(0, 8)} />
      </div>

      <div className="surface-card rounded-xl p-5">
        <p className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-violet-600" /> AI Recommendations
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            "3 suppliers match your open PPE RFQ with verified MDR docs",
            "Financing pre-approval available for robotics fleet lease",
            "Translation queue cleared for FR marketplace listings",
          ].map((rec) => (
            <div key={rec} className="surface-card rounded-lg p-3 text-sm flex items-start gap-2">
              <StatusBadge variant="violet">AI</StatusBadge>
              {rec}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
