"use client";

import Link from "next/link";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export function PortalDashboard({
  title,
  description,
  kpis,
  actions,
  tables,
  actionButton,
}: {
  title: string;
  description: string;
  kpis: { label: string; value: string | number; change?: number; icon?: LucideIcon; accent?: "blue" | "green" | "violet" | "slate" }[];
  actions?: { label: string; href: string }[];
  tables?: { title: string; rows: { cols: string[] }[] }[];
  actionButton?: { label: string; href: string };
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          actionButton && (
            <Link href={actionButton.href}>
              <Button className="bg-blue-600 hover:bg-blue-700">{actionButton.label}</Button>
            </Link>
          )
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <MetricCard key={k.label} {...k} />
        ))}
      </div>
      {actions && actions.length > 0 && (
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Link key={a.href} href={a.href}>
                <Button variant="outline" size="sm">
                  {a.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
      {tables?.map((t) => (
        <div key={t.title} className="surface-card overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 px-5 pt-5 pb-3">{t.title}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    {row.cols.map((col, j) => (
                      <td key={j} className="px-5 py-3 text-slate-700">
                        {j === row.cols.length - 1 && col.includes("review") ? (
                          <StatusBadge variant="warning">{col}</StatusBadge>
                        ) : j === row.cols.length - 1 && col.includes("approved") ? (
                          <StatusBadge variant="success">{col}</StatusBadge>
                        ) : (
                          col
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
