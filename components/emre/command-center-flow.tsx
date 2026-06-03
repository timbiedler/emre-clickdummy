"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUi } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

const FLOW_STEP_KEYS = [
  "dashboard.flow.demand",
  "dashboard.flow.products",
  "dashboard.flow.rfq",
  "dashboard.flow.finance",
  "dashboard.flow.order",
  "dashboard.flow.service",
  "dashboard.flow.growth",
] as const;

const FLOW_HREFS = [
  "/assistant",
  "/marketplace",
  "/rfq",
  "/finance",
  "/orders",
  "/service-network",
  "/admin/growth",
];

export function CommandCenterFlow({ className }: { className?: string }) {
  const { t } = useUi();

  return (
    <div className={cn("surface-card rounded-xl p-4", className)}>
      <p className="text-xs font-medium text-slate-500 mb-3">{t("dashboard.processFlow")}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {FLOW_STEP_KEYS.map((key, i) => (
          <div key={key} className="flex items-center gap-1.5">
            <Link
              href={FLOW_HREFS[i]}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {t(key)}
            </Link>
            {i < FLOW_STEP_KEYS.length - 1 && (
              <ArrowRight className="size-3.5 text-slate-400 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
