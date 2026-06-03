import { pick } from "./generators";
import type { Offer } from "./types";

const statuses: Offer["financingStatus"][] = [
  "pre_approved",
  "under_review",
  "documents_missing",
  "offer_ready",
];

export const offers: Offer[] = Array.from({ length: 30 }, (_, i) => {
  const price = 8500 + i * 3200;
  const vertical = i < 15 ? "medical" : "robotics";
  const termMonths = price > 50000 ? 60 : price > 10000 ? 48 : 36;
  const downPayment = Math.round(price * 0.1);
  const leasingRateMonthly = Math.round(((price - downPayment) * 1.055) / termMonths);

  return {
    id: `off-${String(i + 1).padStart(3, "0")}`,
    rfqId: `rfq-${String((i % 30) + 1).padStart(3, "0")}`,
    vertical,
    supplierId: `sup-${String((i % 10) + (i < 15 ? 1 : 11)).padStart(2, "0")}`,
    price,
    deliveryDays: 5 + (i % 20),
    availability: pick(["In Stock", "Limited", "Made to Order", "Partial"], i),
    financeOption: pick(["Leasing 36mo", "Financing 48mo", "Finetrading", "Rent-to-own 60mo"], i),
    leasingRateMonthly,
    downPayment,
    termMonths,
    monthlyCost: leasingRateMonthly,
    serviceBundle:
      vertical === "robotics"
        ? pick(["Fleet maintenance 12mo", "Showroom support", "Spare parts pool"], i)
        : pick(["MDR compliance support", "Recurring delivery SLA", "Emergency restock"], i),
    financingStatus: pick(statuses, i),
    complianceScore: 75 + (i % 22),
    warranty: `${12 + (i % 24)} months`,
    aiRecommended: i % 4 === 0,
    validUntil: `2026-0${4 + (i % 4)}-${String(10 + (i % 18)).padStart(2, "0")}`,
  };
});
