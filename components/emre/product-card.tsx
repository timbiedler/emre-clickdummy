"use client";

import { motion } from "framer-motion";
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "glass-panel rounded-xl overflow-hidden cursor-pointer group transition-all hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] flex flex-col",
        selected && "ring-2 ring-cyan-500/50"
      )}
    >
      <div className="relative">
        <ProductImagePlaceholder product={product} className="h-36" size="md" />
        {inCompare && (
          <div className="absolute top-2 right-2 rounded-full bg-cyan-500 p-1 z-10">
            <Check className="size-3 text-black" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-cyan-400 font-medium">{product.brand}</p>
          <StatusBadge variant={availabilityVariant[product.availability]}>
            {product.availability.replace("_", " ")}
          </StatusBadge>
        </div>
        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {t(product.name, language)}
        </h3>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Purchase</p>
            <p className="text-base font-semibold neon-text-cyan">
              {formatCurrency(finance.purchasePrice)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Leasing / mo</p>
            <p className="text-base font-semibold neon-text-green">
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

        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3" />
          {product.primaryCountry} · {product.supplierName}
        </p>

        {showActions && (
          <div className="grid grid-cols-2 gap-1.5 pt-2 mt-auto border-t border-white/5">
            <Link href="/rfq" onClick={stop}>
              <Button size="sm" variant="outline" className="w-full h-8 text-[10px] px-2">
                Request Offer
              </Button>
            </Link>
            <Link href="/finance" onClick={stop}>
              <Button size="sm" variant="outline" className="w-full h-8 text-[10px] px-2">
                Leasing Options
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-[10px] px-2 gap-1"
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
              className="h-8 text-[10px] px-2 gap-1"
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
    </motion.div>
  );
}
