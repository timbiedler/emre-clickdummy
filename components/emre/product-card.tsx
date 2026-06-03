"use client";

import Link from "next/link";
import { Check, MapPin, CreditCard, Wrench, Truck, Sparkles, GitCompare } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { ProductImagePlaceholder } from "./product-image-placeholder";
import { useApp } from "@/context/app-context";
import { t } from "@/lib/i18n";
import { formatCurrency } from "@/lib/format";
import { getProductFinance, financeStatusLabel, financeStatusVariant } from "@/lib/product-finance";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const availabilityVariant = {
  in_stock: "success" as const,
  limited: "warning" as const,
  preorder: "info" as const,
  out_of_stock: "danger" as const,
};

export function ProductCard({
  product,
  onClick,
  selected,
  showActions = true,
}: {
  product: Product;
  onClick: () => void;
  selected?: boolean;
  showActions?: boolean;
}) {
  const { language, compareList, toggleCompare, openConsultation } = useApp();
  const inCompare = compareList.includes(product.id);
  const finance = getProductFinance(product);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={onClick}
      className={cn(
        "surface-card rounded-xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-md flex flex-col",
        selected && "ring-2 ring-blue-400 border-blue-200"
      )}
    >
      <div className="relative">
        <ProductImagePlaceholder product={product} className="h-36" size="md" />
        {inCompare && (
          <div className="absolute top-2 right-2 rounded-full bg-blue-600 p-1 z-10">
            <Check className="size-3 text-white" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-2.5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-slate-500 font-medium">{product.brand}</p>
          <StatusBadge variant={availabilityVariant[product.availability]}>
            {product.availability.replace("_", " ")}
          </StatusBadge>
        </div>
        <h3 className="font-medium text-sm leading-snug line-clamp-2 text-slate-900 group-hover:text-blue-700 transition-colors">
          {t(product.name, language)}
        </h3>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Purchase</p>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(finance.purchasePrice)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Leasing / mo</p>
            <p className="text-base font-semibold text-accent-green">
              {formatCurrency(finance.leasingRateMonthly)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          <StatusBadge variant={financeStatusVariant[finance.status]}>
            <CreditCard className="size-3 mr-1" />
            {financeStatusLabel[finance.status]}
          </StatusBadge>
          <StatusBadge variant="default">
            <Truck className="size-3 mr-1" />
            {product.deliveryDays}d delivery
          </StatusBadge>
          {product.serviceCoverage && (
            <StatusBadge variant="info">
              <Wrench className="size-3 mr-1" /> Service
            </StatusBadge>
          )}
        </div>

        <p className="text-[11px] text-slate-500 flex items-center gap-1">
          <MapPin className="size-3" />
          {product.primaryCountry} · {product.supplierName}
        </p>

        {showActions && (
          <div className="grid grid-cols-2 gap-2 pt-3 mt-auto border-t border-slate-100">
            <Link href="/rfq" onClick={stop}>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                Request Offer
              </Button>
            </Link>
            <Link href="/finance" onClick={stop}>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                Leasing Options
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={(e) => {
                stop(e);
                openConsultation(product.id);
              }}
            >
              <Sparkles className="size-3" /> AI Sales Advice
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={(e) => {
                stop(e);
                toggleCompare(product.id);
              }}
            >
              <GitCompare className="size-3" /> Compare
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
