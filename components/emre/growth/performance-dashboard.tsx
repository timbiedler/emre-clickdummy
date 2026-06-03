"use client";

import { growthPerformanceKpis, growthPerformanceTrend } from "@/data/growth";
import { MetricCard } from "@/components/emre/metric-card";
import { useUi } from "@/lib/ui-i18n";
import {
  Target,
  Radio,
  Megaphone,
  Mail,
  FileText,
  CreditCard,
  Handshake,
  TrendingUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

export function PerformanceDashboard() {
  const { t } = useUi();
  const k = growthPerformanceKpis;
  const [detailLabel, setDetailLabel] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("growth.performance.leads")}
          value={k.leadsDiscovered}
          change={12.4}
          icon={Target}
          accent="blue"
          onClick={() => setDetailLabel(t("growth.performance.leads"))}
        />
        <MetricCard
          label={t("growth.performance.signals")}
          value={k.signalsProcessed}
          change={8.1}
          icon={Radio}
          accent="violet"
        />
        <MetricCard
          label={t("growth.performance.campaigns")}
          value={k.campaignsActive}
          icon={Megaphone}
          accent="green"
        />
        <MetricCard
          label={t("growth.performance.outreach")}
          value={k.outreachSent}
          change={15.2}
          icon={Mail}
          accent="slate"
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MQL %" value={`${k.mqlConversion}%`} icon={TrendingUp} accent="blue" />
        <MetricCard label="SQL %" value={`${k.sqlConversion}%`} icon={TrendingUp} accent="green" />
        <MetricCard label={t("growth.performance.rfqs")} value={k.rfqsCreated} icon={FileText} accent="blue" />
        <MetricCard label={t("growth.performance.offers")} value={k.offersPrepared} icon={FileText} accent="violet" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("growth.performance.leasing")}
          value={`€${k.leasingPipeline}M`}
          icon={CreditCard}
          accent="green"
        />
        <MetricCard
          label={t("growth.performance.partnerTasks")}
          value={k.partnerTasksOpen}
          icon={Handshake}
          accent="slate"
        />
        <MetricCard
          label={t("growth.performance.budget")}
          value={`${k.budgetUtilization}%`}
          icon={Target}
          accent="blue"
        />
        <MetricCard label={t("growth.performance.roi")} value={`${k.roiYtd}x`} icon={TrendingUp} accent="green" />
      </div>

      <div className="surface-card rounded-xl p-5">
        <p className="text-sm font-semibold mb-4">{t("growth.performance.trend")}</p>
        <div className="flex items-end gap-2 h-36">
          {growthPerformanceTrend.map((w) => (
            <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(w.leads / 210) * 100}%` }}
                title={`${w.leads} leads`}
              />
              <span className="text-[10px] text-slate-500">{w.week}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="surface-card rounded-xl p-4">
          <p className="text-slate-500 text-xs">{t("growth.performance.whiteSpots")}</p>
          <p className="text-2xl font-bold mt-1">{k.whiteSpotsClosed}</p>
        </div>
        <div className="surface-card rounded-xl p-4">
          <p className="text-slate-500 text-xs">{t("growth.performance.coverage")}</p>
          <p className="text-2xl font-bold mt-1">{k.territoryCoverage}%</p>
        </div>
      </div>

      <Sheet open={!!detailLabel} onOpenChange={() => setDetailLabel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{detailLabel}</SheetTitle>
          </SheetHeader>
          <p className="mt-4 text-sm text-slate-600">{t("growth.performance.detailBody")}</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
