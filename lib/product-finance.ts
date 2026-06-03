import type { Product, Vertical } from "@/data/types";

export type FinanceStatus =
  | "documents_missing"
  | "under_review"
  | "pre_approved"
  | "offer_ready";

export type FinanceMode =
  | "buy"
  | "lease"
  | "rent_to_own"
  | "finetrading"
  | "subscription";

export interface ProductFinance {
  purchasePrice: number;
  leasingRateMonthly: number;
  termMonths: number;
  downPayment: number;
  monthlyCostEstimate: number;
  status: FinanceStatus;
  finetradingAvailable: boolean;
  modes: FinanceMode[];
}

const statuses: FinanceStatus[] = [
  "pre_approved",
  "under_review",
  "documents_missing",
  "offer_ready",
];

export function getProductFinance(product: Product): ProductFinance {
  const purchasePrice = product.price;
  const termMonths =
    purchasePrice > 50000 ? 60 : purchasePrice > 10000 ? 48 : purchasePrice > 500 ? 36 : 24;
  const downPayment = Math.max(
    Math.round(purchasePrice * (purchasePrice > 5000 ? 0.1 : 0)),
    purchasePrice > 5000 ? 500 : 0
  );
  const financed = purchasePrice - downPayment;
  const leasingRateMonthly = Math.max(
    Math.round((financed * 1.055) / termMonths),
    purchasePrice > 100 ? 29 : 9
  );
  const monthlyCostEstimate = leasingRateMonthly;
  const idx = product.id.charCodeAt(product.id.length - 1) % statuses.length;

  const modes: FinanceMode[] =
    product.vertical === "robotics"
      ? ["buy", "lease", "rent_to_own", "finetrading", "subscription"]
      : purchasePrice > 5000
        ? ["buy", "lease", "finetrading"]
        : ["buy", "lease", "subscription"];

  return {
    purchasePrice,
    leasingRateMonthly,
    termMonths,
    downPayment,
    monthlyCostEstimate,
    status: statuses[idx],
    finetradingAvailable: purchasePrice > 2000,
    modes,
  };
}

export function getOfferFinance(price: number, vertical: Vertical) {
  const termMonths = price > 50000 ? 60 : price > 10000 ? 48 : 36;
  const downPayment = Math.round(price * 0.1);
  const leasingRateMonthly = Math.round(((price - downPayment) * 1.055) / termMonths);
  return {
    purchasePrice: price,
    leasingRateMonthly,
    downPayment,
    termMonths,
    monthlyCost: leasingRateMonthly,
    serviceBundle:
      vertical === "robotics" ? "Fleet maintenance 12mo" : "Compliance support package",
    financingStatus: statuses[price % statuses.length],
  };
}

export const financeStatusLabel: Record<FinanceStatus, string> = {
  documents_missing: "Documents Missing",
  under_review: "Under Review",
  pre_approved: "Pre-approved",
  offer_ready: "Offer Ready",
};

export const financeStatusVariant: Record<
  FinanceStatus,
  "success" | "warning" | "info" | "danger"
> = {
  documents_missing: "danger",
  under_review: "warning",
  pre_approved: "info",
  offer_ready: "success",
};
