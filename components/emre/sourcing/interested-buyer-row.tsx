"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/emre/status-badge";
import type { InterestedBuyer } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";

export function InterestedBuyerRow({
  buyer,
  onNotify,
}: {
  buyer: InterestedBuyer;
  onNotify?: () => void;
}) {
  const { t } = useUi();

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-3 px-2 text-sm font-medium text-slate-900">{buyer.companyName}</td>
      <td className="py-3 px-2 text-xs text-slate-600">{buyer.requestedProduct}</td>
      <td className="py-3 px-2 text-xs">{buyer.country}</td>
      <td className="py-3 px-2 text-xs">{buyer.estimatedVolume}</td>
      <td className="py-3 px-2 text-xs">{formatCurrency(buyer.budget)}</td>
      <td className="py-3 px-2">
        <StatusBadge variant={buyer.notificationStatus === "sent" ? "success" : "warning"}>
          {buyer.notificationStatus}
        </StatusBadge>
      </td>
      <td className="py-3 px-2">
        <Button size="sm" variant="outline" className="h-8" onClick={onNotify}>
          {t("sourcing.notifyBuyer")}
        </Button>
      </td>
    </tr>
  );
}
