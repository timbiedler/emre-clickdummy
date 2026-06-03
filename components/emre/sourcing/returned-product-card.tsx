"use client";

import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/emre/status-badge";
import type { ReturnedProduct } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";
import { useApp } from "@/context/app-context";
import { useRfq } from "@/context/rfq-context";
import { useSourcing } from "@/context/sourcing-context";

export function ReturnedProductCard({
  product,
  onPublish,
}: {
  product: ReturnedProduct;
  onPublish?: () => void;
}) {
  const { t } = useUi();
  const { openCreateRfq } = useRfq();
  const { showToast } = useApp();
  const { notifyInterestedBuyers } = useSourcing();
  const router = useRouter();

  return (
    <div className="surface-card rounded-xl p-4 space-y-3">
      <div className="flex justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{product.productName}</p>
        {product.launched ? (
          <StatusBadge variant="success">{t("sourcing.launched")}</StatusBadge>
        ) : (
          <StatusBadge variant="warning">{t("sourcing.readyToLaunch")}</StatusBadge>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {product.supplierName} · {product.vertical}
      </p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="font-semibold text-slate-900">{product.marketplaceReadiness}%</p>
          <p className="text-slate-500">{t("sourcing.marketplaceReadiness")}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="font-semibold text-slate-900">{product.leasingReadiness}%</p>
          <p className="text-slate-500">{t("sourcing.leasingReadiness")}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="font-semibold text-slate-900">{product.serviceReadiness}%</p>
          <p className="text-slate-500">{t("sourcing.serviceReadiness")}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 h-8" onClick={onPublish}>
          <Rocket className="size-3" /> {t("sourcing.publishMarketplace")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => {
            notifyInterestedBuyers(product.id);
            showToast(t("sourcing.notifyBuyers"));
          }}
        >
          {t("sourcing.notifyBuyers")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => {
            showToast("Campaign draft created");
            router.push("/admin/growth");
          }}
        >
          {t("sourcing.createCampaign")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() =>
            openCreateRfq({
              source: "sourcing",
              productName: product.productName,
              category: product.vertical,
              sourcingNotes: `Sourcing desk return · ${product.supplierName}`,
              vertical: product.vertical,
            })
          }
        >
          {t("rfq.createRfq")}
        </Button>
      </div>
    </div>
  );
}
