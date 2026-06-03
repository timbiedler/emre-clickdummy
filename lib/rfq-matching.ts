import { suppliers } from "@/data/suppliers";
import type { Country, TranslationStatus, Vertical } from "@/data/types";

export interface RfqMatchCriteria {
  vertical: Vertical;
  category?: string;
  deliveryCountry?: Country;
  financeInterest?: boolean;
  leasingInterest?: boolean;
  productSupplierId?: string;
}

export interface MatchedSupplier {
  id: string;
  name: string;
  country: Country;
  score: number;
  availability: "in_stock" | "limited" | "preorder";
  deliveryEstimateDays: number;
  documentReadiness: number;
  financeReady: boolean;
  leasingReady: boolean;
  translationStatus: TranslationStatus;
  responseTime: string;
  complianceScore: number;
}

function hashScore(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % 997;
  return min + (h % (max - min + 1));
}

export function matchSuppliersForRfq(criteria: RfqMatchCriteria): MatchedSupplier[] {
  const pool = suppliers.filter((s) => s.vertical === criteria.vertical);

  return pool
    .map((s, i) => {
      let score = 55 + (s.rating - 4) * 20 + Math.floor(s.complianceScore / 5);
      if (criteria.deliveryCountry && s.country === criteria.deliveryCountry) score += 12;
      if (criteria.productSupplierId && s.id === criteria.productSupplierId) score += 18;
      if (criteria.category && s.salesChannels.some((c) => c.toLowerCase().includes(criteria.category!.slice(0, 4).toLowerCase()))) {
        score += 8;
      }
      if (criteria.financeInterest && s.complianceScore >= 85) score += 5;
      if (criteria.leasingInterest && i % 2 === 0) score += 4;
      score = Math.min(99, Math.max(42, score));

      const availability = (["in_stock", "limited", "preorder"] as const)[i % 3];
      const deliveryEstimateDays = hashScore(s.id + (criteria.deliveryCountry ?? ""), 5, 28);
      const documentReadiness = hashScore(s.id + "doc", 62, 98);

      return {
        id: s.id,
        name: s.name,
        country: s.country,
        score,
        availability,
        deliveryEstimateDays,
        documentReadiness,
        financeReady: s.complianceScore >= 80,
        leasingReady: s.complianceScore >= 75 && s.onboardingStatus === "approved",
        translationStatus: s.translationStatus,
        responseTime: s.responseTime,
        complianceScore: s.complianceScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function mockTranslateMessage(
  message: string,
  source: string,
  target: string
): string {
  if (!message.trim()) return "";
  if (source === target) return message;
  return `[${source.toUpperCase()}→${target.toUpperCase()}] ${message}`;
}

export function suggestRfqMessage(opts: {
  productName?: string;
  quantity: number;
  deliveryCountry: Country;
  category?: string;
  financeInterest?: boolean;
}): string {
  const parts = [
    `We request a competitive offer for ${opts.quantity.toLocaleString()} units`,
    opts.productName ? `of ${opts.productName}` : opts.category ? `in category ${opts.category}` : "",
    `with confirmed delivery to ${opts.deliveryCountry}.`,
  ];
  if (opts.financeInterest) parts.push("Please include leasing and financing options.");
  return parts.filter(Boolean).join(" ");
}
