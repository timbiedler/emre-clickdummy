import { COUNTRIES } from "./constants";
import { localize, pick } from "./generators";
import type { RFQ } from "./types";

const medicalRfqs = [
  "500,000 nitrile gloves for care group in Germany",
  "80 oxygen concentrators for public-sector emergency supply",
  "Lab consumables for multi-site diagnostics network",
  "FFP2 masks bulk order for hospital alliance",
  "Patient monitors for ICU expansion project",
  "Sterilization equipment for surgical center",
  "Wound care supplies for nursing home chain",
  "Rapid diagnostic tests for test center network",
  "Care beds for regional care home rollout",
  "Emergency trauma kits for NGO deployment",
  "Disinfectant supply contract 12 months",
  "Respiratory equipment for clinic group",
  "PPE bundle for public health authority",
  "Lab analyzer modules for reference lab",
  "Hygiene consumables framework agreement",
];

const roboticsRfqs = [
  "12 cleaning robots for hotel group in DACH",
  "Security patrol robots for industrial site",
  "Spare parts bundle for 40 deployed cleaning robots",
  "Lawn robots for municipal parks maintenance",
  "Warehouse AMRs for logistics center expansion",
  "Hotel service robots for 8-property rollout",
  "Battery packs for existing robot fleet",
  "Annual service contracts for cleaning fleet",
  "Inspection robots for agricultural cooperative",
  "Showroom demo units for dealership network",
  "Sensor modules for security robot upgrade",
  "Brush replacement kits quarterly supply",
  "Fleet management licenses for 25 units",
  "Maintenance robots for car dealership chain",
  "Multi-site cleaning robot deployment EU-wide",
];

function makeRfqs(
  titles: string[],
  vertical: "medical" | "robotics",
  startId: number
): RFQ[] {
  return titles.map((title, i) => ({
    id: `rfq-${String(startId + i).padStart(3, "0")}`,
    vertical,
    title: localize(title),
    buyerId: `buy-${String((i % 10) + (vertical === "medical" ? 1 : 11)).padStart(2, "0")}`,
    status: pick(
      ["active", "matching", "offers_received", "draft", "closed"] as const,
      i
    ),
    quantity: 10 + i * 47,
    budget: 5000 + i * 12500,
    deliveryCountry: pick(COUNTRIES, i),
    createdAt: `2026-0${1 + (i % 5)}-${String(1 + (i % 28)).padStart(2, "0")}`,
    deadline: `2026-0${3 + (i % 3)}-${String(15 + (i % 14)).padStart(2, "0")}`,
    matchedSuppliers: 2 + (i % 6),
    offersCount: i % 4,
    translationStatus: pick(["verified", "pending", "auto"] as const, i),
    message: localize(
      `We require competitive offers with confirmed delivery to ${pick(COUNTRIES, i)} within the specified timeframe.`
    ),
  }));
}

export const rfqs: RFQ[] = [
  ...makeRfqs(medicalRfqs, "medical", 1),
  ...makeRfqs(roboticsRfqs, "robotics", 16),
];
