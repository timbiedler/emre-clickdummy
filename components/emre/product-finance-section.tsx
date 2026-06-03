"use client";

import Link from "next/link";
import { CreditCard, Calculator, Upload, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/format";
import {
  financeStatusLabel,
  financeStatusVariant,
  getProductFinance,
} from "@/lib/product-finance";
import type { Product } from "@/data/types";

export function ProductFinanceSection({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const finance = getProductFinance(product);

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4 neon-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CreditCard className="size-4 text-emerald-400" />
          Finance & Leasing
        </h3>
        <StatusBadge variant={financeStatusVariant[finance.status]}>
          {financeStatusLabel[finance.status]}
        </StatusBadge>
      </div>

      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        <FinanceCell label="Purchase Price" value={formatCurrency(finance.purchasePrice)} highlight />
        <FinanceCell label="Leasing / mo" value={formatCurrency(finance.leasingRateMonthly)} highlight />
        <FinanceCell label="Term" value={`${finance.termMonths} months`} />
        <FinanceCell label="Down Payment" value={formatCurrency(finance.downPayment)} />
        <FinanceCell label="Monthly Estimate" value={formatCurrency(finance.monthlyCostEstimate)} />
        <FinanceCell
          label="Finetrading"
          value={finance.finetradingAvailable ? "Available" : "On request"}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {finance.modes.map((mode) => (
          <StatusBadge key={mode} variant="violet">
            {mode.replace("_", " ")}
          </StatusBadge>
        ))}
      </div>

      <div className={`flex flex-wrap gap-2 ${compact ? "" : "pt-1"}`}>
        <Link href="/finance">
          <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-500">
            <Calculator className="size-4" /> Calculate Leasing
          </Button>
        </Link>
        <Link href="/data-room">
          <Button size="sm" variant="outline" className="gap-2">
            <Upload className="size-4" /> Upload Documents
          </Button>
        </Link>
        <Link href="/finance">
          <Button size="sm" variant="outline" className="gap-2">
            <FileCheck className="size-4" /> Request Financing
          </Button>
        </Link>
      </div>
    </div>
  );
}

function FinanceCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="glass-panel rounded-lg p-2.5">
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "neon-text-green" : ""}`}>{value}</p>
    </div>
  );
}
