"use client";

import { MetricCard } from "@/components/emre/metric-card";
import { getSourcingKpis } from "@/data/sourcing";
import { useSourcing } from "@/context/sourcing-context";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";
import {
  AlertTriangle,
  Package,
  Search,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function SourcingKpiSection() {
  const { t } = useUi();
  const { productGapRequests } = useSourcing();
  const kpi = getSourcingKpis(productGapRequests);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        label={t("sourcing.kpiOpenGaps")}
        value={kpi.openDemandGaps}
        icon={AlertTriangle}
        accent="violet"
      />
      <MetricCard
        label={t("sourcing.kpiGapRequests")}
        value={kpi.productGapRequests}
        icon={Search}
        accent="blue"
      />
      <MetricCard
        label={t("sourcing.kpiHighPriority")}
        value={kpi.highPriorityGaps}
        icon={TrendingUp}
        accent="green"
      />
      <MetricCard
        label={t("sourcing.kpiEnrichment")}
        value={kpi.productsInEnrichment}
        icon={Sparkles}
        accent="slate"
      />
      <MetricCard
        label={t("sourcing.kpiBuyersWaiting")}
        value={kpi.interestedBuyersWaiting}
        icon={Users}
        accent="blue"
      />
      <MetricCard
        label={t("sourcing.kpiMarketplaceReady")}
        value={kpi.marketplaceReady}
        icon={Package}
        accent="green"
      />
      <MetricCard
        label={t("sourcing.kpiReturned")}
        value={kpi.returnedThisMonth}
        icon={Package}
        accent="violet"
      />
      <MetricCard
        label={t("sourcing.kpiPipelineValue")}
        value={formatCurrency(kpi.pipelineValue)}
        icon={TrendingUp}
        accent="blue"
      />
      <MetricCard
        label={t("sourcing.kpiLeasingDemand")}
        value={formatCurrency(kpi.leasingDemand)}
        icon={Sparkles}
        accent="slate"
      />
      <MetricCard
        label={t("sourcing.kpiSuppliersContacted")}
        value={kpi.suppliersContacted}
        icon={Users}
        accent="green"
      />
    </div>
  );
}
