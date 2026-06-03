import { localize, pick } from "./generators";
import type { Deal } from "./types";

const medicalDeals = [
  "Volume discount: Nitrile gloves 500k+ units",
  "Bundle: FFP2 masks + disinfectant supply",
  "Public sector framework: diagnostic tests",
  "Care home package: monitoring equipment",
  "Emergency supply fast-track pricing",
  "Lab consumables quarterly contract",
  "Sterilization equipment lease special",
  "PPE seasonal promotion Q2",
];

const roboticsDeals = [
  "Hotel group: 10+ cleaning robots bundle",
  "Fleet spare parts annual contract",
  "Leasing special: security patrol robots",
  "Showroom demo unit promotion",
  "Warehouse AMR volume discount",
  "Service package: 3-year maintenance",
  "Battery pack bulk pricing",
  "Municipal cleaning robot framework",
];

function makeDeals(
  titles: string[],
  vertical: "medical" | "robotics",
  startId: number
): Deal[] {
  const types: Deal["type"][] = [
    "volume",
    "bundle",
    "promotion",
    "leasing",
    "service",
  ];
  return titles.map((title, i) => ({
    id: `deal-${String(startId + i).padStart(2, "0")}`,
    vertical,
    title: localize(title),
    discount: 5 + (i % 4) * 5,
    validUntil: `2026-0${5 + (i % 3)}-${String(20 + (i % 10)).padStart(2, "0")}`,
    type: pick(types, i),
    supplierId: `sup-${String((i % 5) + (vertical === "medical" ? 1 : 11)).padStart(2, "0")}`,
    limitedStock: i % 3 === 0 ? 10 + i * 5 : undefined,
  }));
}

export const deals: Deal[] = [
  ...makeDeals(medicalDeals, "medical", 1),
  ...makeDeals(roboticsDeals, "robotics", 9),
];
