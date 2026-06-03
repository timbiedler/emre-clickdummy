"use client";

import { useState } from "react";
import { PageHeader } from "@/components/emre/app-shell";
import { AdminMetricGrid, AdminKpiCard } from "@/components/emre/admin-kpi-card";
import { ActivityFeed, AlertCenter } from "@/components/emre/activity-feed";
import { FlowDiagram } from "@/components/emre/flow-diagram";
import { VerticalSwitcher } from "@/components/emre/vertical-switcher";
import { useApp } from "@/context/app-context";
import { adminMetrics, adminAlerts, adminActivities } from "@/data/admin-metrics";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const countryData = [
  { country: "DE", value: 34 },
  { country: "FR", value: 18 },
  { country: "AT", value: 12 },
  { country: "CH", value: 10 },
  { country: "NL", value: 8 },
  { country: "Other", value: 18 },
];

const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#0ea5e9", "#ea580c", "#64748b"];

export default function AdminPage() {
  const { adminVertical, setAdminVertical } = useApp();
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const metrics = adminMetrics.find((m) => m.vertical === adminVertical)!;
  const filteredAlerts = adminAlerts.filter(
    (a) => adminVertical === "combined" || a.vertical === adminVertical || a.vertical === "combined"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin / Operations"
        description="Platform command center — KPIs, pipelines, alerts, and performance analytics for both verticals."
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-xl surface-card p-1 gap-1">
          {(["combined", "medical", "robotics"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAdminVertical(v)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all",
                adminVertical === v
                  ? "bg-blue-50 text-blue-700"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "combined" ? "Combined" : v}
            </button>
          ))}
        </div>
        <VerticalSwitcher />
      </div>

      <AdminMetricGrid metrics={metrics} />
      <AdminKpiCard metrics={metrics} onKpiClick={setFilterLabel} />

      {filterLabel && (
        <div className="surface-card rounded-lg p-3 text-sm flex items-center justify-between">
          <span>Filtered view: <strong>{filterLabel}</strong></span>
          <button onClick={() => setFilterLabel(null)} className="text-blue-600 text-xs hover:underline">Clear</button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Country Performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countryData}>
              <XAxis dataKey="country" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#1e1b2e", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="surface-card rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Category Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={countryData} dataKey="value" nameKey="country" cx="50%" cy="50%" outerRadius={80}>
                {countryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e1b2e", border: "1px solid rgba(255,255,255,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertCenter alerts={filteredAlerts} />
        </div>
        <div className="space-y-4">
          <ActivityFeed items={adminActivities} />
          <FlowDiagram />
        </div>
      </div>
    </div>
  );
}
