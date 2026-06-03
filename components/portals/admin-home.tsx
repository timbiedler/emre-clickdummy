"use client";

import {
  FileText,
  Package,
  CreditCard,
  TrendingUp,
  Sparkles,
  Handshake,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { ActivityFeed } from "@/components/emre/activity-feed";
import { FlowDiagram } from "@/components/emre/flow-diagram";
import { RFQCard } from "@/components/emre/rfq-card";
import { useApp } from "@/context/app-context";
import { adminActivities } from "@/data/admin-metrics";
import { rfqs, orders, financeApplications } from "@/data";
import { salesPartnerApplications } from "@/data/sales-partners";
import { platformUsers } from "@/data/users";
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

export default function AdminHomePage() {
  const { vertical, industry } = useApp();
  const verticalRfqs = rfqs.filter(
    (r) => r.vertical === vertical && r.status !== "closed"
  ).slice(0, 3);
  const inTransit = orders.filter(
    (o) => o.vertical === vertical && (o.status === "shipped" || o.status === "partial")
  ).length;
  const financeApps = financeApplications.filter((f) => f.vertical === vertical);
  const pendingPartners = salesPartnerApplications.filter(
    (a) => a.approvalStatus === "pending" || a.approvalStatus === "review"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Platform operations — RFQs, onboarding queues, finance pipeline, and network performance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="RFQ Volume" value={234} change={14.2} icon={FileText} accent="blue" />
        <MetricCard label="Sales Partners" value={15} change={8.1} icon={Handshake} accent="green" />
        <MetricCard label="Partner Onboarding Queue" value={pendingPartners} icon={Handshake} accent="violet" />
        <MetricCard label="Active Users" value={platformUsers.length} icon={Users} accent="slate" />
        <MetricCard label="Leasing Requests" value={financeApps.length + 12} change={18.6} icon={CreditCard} accent="green" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Orders in Transit" value={inTransit} icon={Package} accent="green" />
        <MetricCard label="Finance Readiness Queue" value={8} icon={CreditCard} accent="blue" />
        <MetricCard label="AI Consultations" value={47} change={22.1} icon={Sparkles} accent="violet" />
        <MetricCard label={`${industry} demand index`} value="84" change={6.2} icon={TrendingUp} accent="blue" />
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
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} />
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

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/sales-partners" className="surface-card p-5 hover:border-blue-200 transition-colors">
          <p className="text-sm font-semibold text-slate-900">Sales partner onboarding</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingPartners} applications</p>
          <p className="text-xs text-slate-500 mt-1">Review partner profiles, territories, and commission models</p>
        </Link>
        <Link href="/admin/users" className="surface-card p-5 hover:border-blue-200 transition-colors">
          <p className="text-sm font-semibold text-slate-900">Users & roles</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{platformUsers.length} users</p>
          <p className="text-xs text-slate-500 mt-1">Manage role assignments and industry context</p>
        </Link>
      </div>
    </div>
  );
}
