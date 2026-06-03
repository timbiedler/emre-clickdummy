"use client";

import { Button } from "@/components/ui/button";
import type { ProductEnrichmentItem } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";

const fields: (keyof ProductEnrichmentItem)[] = [
  "textReadiness",
  "specsReadiness",
  "imageReadiness",
  "videoReadiness",
  "certificatesReadiness",
  "translationsReadiness",
  "salesChannelReadiness",
  "leasingReadiness",
  "serviceReadiness",
  "insuranceReadiness",
  "seoReadiness",
  "marketplaceReadiness",
];

export function EnrichmentChecklist({ item }: { item: ProductEnrichmentItem }) {
  const { t } = useUi();

  return (
    <div className="surface-card rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
          <p className="text-xs text-slate-500">{item.supplierName}</p>
        </div>
        <span className="text-sm font-bold text-blue-600">{item.marketplaceReadiness}%</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map((f) => {
          const val = item[f];
          if (typeof val !== "number") return null;
          return (
            <div key={f} className="flex items-center gap-2">
              <div
                className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden"
                title={`${val}%`}
              >
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${val}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 w-16 truncate">
                {f.replace("Readiness", "")}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <Button size="sm" variant="outline" className="h-8 text-xs">
          {t("sourcing.generateSummary")}
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          {t("sourcing.markReady")}
        </Button>
      </div>
    </div>
  );
}
