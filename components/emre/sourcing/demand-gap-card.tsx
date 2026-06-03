"use client";

import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import type { DemandGap } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";
import { ArrowRight, Users } from "lucide-react";

const priorityVariant = {
  critical: "danger" as const,
  high: "warning" as const,
  medium: "info" as const,
  low: "default" as const,
};

export function DemandGapCard({
  gap,
  onCreateRequest,
  onAssign,
  onArchive,
}: {
  gap: DemandGap;
  onCreateRequest: () => void;
  onAssign?: () => void;
  onArchive?: () => void;
}) {
  const { t } = useUi();

  return (
    <div className="surface-card rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{gap.title}</p>
          <p className="text-xs text-slate-500 mt-1">
            {gap.requestedProduct} · {gap.category}
          </p>
        </div>
        <StatusBadge variant={priorityVariant[gap.priority]}>{gap.priority}</StatusBadge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <StatusBadge variant="default">{gap.vertical}</StatusBadge>
        <StatusBadge variant="info">{gap.country}</StatusBadge>
        <StatusBadge variant="violet">{gap.source.replace(/_/g, " ")}</StatusBadge>
        {gap.supplierCoverage === "none" && (
          <StatusBadge variant="danger">{t("sourcing.noSupplierCoverage")}</StatusBadge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Users className="size-3" /> {gap.interestedBuyers} {t("sourcing.buyers")}
        </span>
        <span>{formatCurrency(gap.estimatedBudget)}</span>
        <span>{gap.estimatedVolume}</span>
        <span>{gap.urgency} {t("sourcing.urgency")}</span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2">{gap.aiRecommendation}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {gap.status === "open" && (
          <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 h-8" onClick={onCreateRequest}>
            {t("sourcing.createGapRequest")} <ArrowRight className="size-3" />
          </Button>
        )}
        {gap.status === "linked" && gap.linkedRequestId && (
          <StatusBadge variant="success">{gap.linkedRequestId}</StatusBadge>
        )}
        {onAssign && (
          <Button size="sm" variant="outline" className="h-8" onClick={onAssign}>
            {t("sourcing.assignOwner")}
          </Button>
        )}
        {onArchive && gap.status === "open" && (
          <Button size="sm" variant="ghost" className="h-8" onClick={onArchive}>
            {t("sourcing.archive")}
          </Button>
        )}
      </div>
    </div>
  );
}
