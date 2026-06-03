"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/emre/status-badge";
import { useSourcing } from "@/context/sourcing-context";
import { sourcingOwners } from "@/data/sourcing";
import type { ProductGapRequest, ProductGapRequestStatus } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";

const statusVariant = (s: ProductGapRequestStatus) => {
  if (s === "returned_marketplace" || s === "buyers_notified") return "success" as const;
  if (s === "archived") return "default" as const;
  if (s === "new") return "info" as const;
  return "warning" as const;
};

export function ProductGapDrawer({
  request,
  open,
  onClose,
}: {
  request: ProductGapRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useUi();
  const { updateRequestStatus, assignRequestOwner, notifyInterestedBuyers } = useSourcing();
  if (!request) return null;

  const owner = sourcingOwners.find((o) => o.id === request.assignedOwner);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-xl p-0">
        <ScrollArea className="h-full p-6">
          <SheetHeader className="text-left">
            <p className="text-xs font-mono text-slate-500">{request.id}</p>
            <SheetTitle>{request.requestedProduct}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-wrap gap-2 mt-4">
            <StatusBadge variant={statusVariant(request.status)}>
              {request.status.replace(/_/g, " ")}
            </StatusBadge>
            <StatusBadge variant="default">{request.vertical}</StatusBadge>
            <StatusBadge variant="violet">{request.country}</StatusBadge>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-slate-800">
            <p className="text-xs font-medium text-blue-700 mb-1">{t("sourcing.aiRecommendation")}</p>
            {request.aiSourcingRecommendation}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <Info label={t("sourcing.industry")} value={request.industry} />
            <Info label={t("sourcing.volume")} value={request.estimatedVolume} />
            <Info label={t("sourcing.budget")} value={formatCurrency(request.expectedBudget)} />
            <Info label={t("sourcing.urgency")} value={request.urgency} />
            <Info label={t("sourcing.owner")} value={owner?.name ?? "—"} />
            <Info label={t("sourcing.source")} value={request.source.replace(/_/g, " ")} />
          </div>

          {request.linkedRfqIds.length > 0 && (
            <p className="text-xs text-slate-500 mt-4">
              RFQs: {request.linkedRfqIds.join(", ")}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRequestStatus(request.id, "supplier_search")}
            >
              {t("sourcing.startSupplierSearch")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRequestStatus(request.id, "product_enrichment")}
            >
              {t("sourcing.sendToEnrichment")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRequestStatus(request.id, "marketplace_readiness")}
            >
              {t("sourcing.markMarketplaceReady")}
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => notifyInterestedBuyers(request.id)}
            >
              {t("sourcing.notifyBuyers")}
            </Button>
            {sourcingOwners[0] && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => assignRequestOwner(request.id, sourcingOwners[0].id)}
              >
                {t("sourcing.assignOwner")}
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[10px] uppercase text-slate-400">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}
