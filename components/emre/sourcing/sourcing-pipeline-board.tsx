"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/emre/status-badge";
import { PIPELINE_COLUMNS } from "@/data/sourcing-types";
import type { ProductGapRequest, ProductGapRequestStatus } from "@/data/sourcing-types";
import { useSourcing } from "@/context/sourcing-context";
import { useUi } from "@/lib/ui-i18n";

export function SourcingPipelineBoard({
  requests,
  onSelect,
}: {
  requests: ProductGapRequest[];
  onSelect: (id: string) => void;
}) {
  const { t } = useUi();
  const { updateRequestStatus } = useSourcing();

  const nextStatus: Partial<Record<ProductGapRequestStatus, ProductGapRequestStatus>> = {
    new: "under_review",
    under_review: "supplier_search",
    supplier_search: "supplier_contacted",
    supplier_contacted: "data_requested",
    data_requested: "commercial_review",
    commercial_review: "product_enrichment",
    product_enrichment: "marketplace_readiness",
    marketplace_readiness: "returned_marketplace",
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-3 min-w-[1200px]">
        {PIPELINE_COLUMNS.map((col) => {
          const cards = requests.filter((r) => r.status === col.id);
          return (
            <div
              key={col.id}
              className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50/80 p-3"
            >
              <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                {t(col.labelKey)} ({cards.length})
              </p>
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {cards.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelect(r.id)}
                    className="w-full text-left rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-200 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {r.requestedProduct}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {r.country} · {r.industry}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <StatusBadge variant="info">{r.urgency}</StatusBadge>
                      <StatusBadge variant="default">{r.interestedBuyerIds.length} buyers</StatusBadge>
                    </div>
                    {nextStatus[col.id] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 mt-2 text-xs w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateRequestStatus(r.id, nextStatus[col.id]!);
                        }}
                      >
                        {t("sourcing.advanceStatus")}
                      </Button>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
