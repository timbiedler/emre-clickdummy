import type { Industry, Product, Vertical } from "@/data/types";

const CATEGORY_PRIMARY_INDUSTRIES: Record<string, Industry[]> = {
  Diagnostics: ["Hospital / Clinic", "Laboratory", "Doctor Practice", "Public Sector"],
  PPE: ["Hospital / Clinic", "Care Home / Care Group", "Laboratory", "Public Sector"],
  Consumables: ["Hospital / Clinic", "Care Home / Care Group", "Doctor Practice"],
  Laboratory: ["Laboratory", "Hospital / Clinic", "Public Sector"],
  "Medical Devices": ["Hospital / Clinic", "Care Home / Care Group", "Doctor Practice"],
  Hygiene: ["Hospital / Clinic", "Care Home / Care Group", "Hospitality", "Cleaning Company"],
  "Emergency Supply": ["Hospital / Clinic", "Public Sector", "Municipality"],
  "Care Equipment": ["Care Home / Care Group", "Hospital / Clinic"],
  Monitoring: ["Hospital / Clinic", "Care Home / Care Group"],
  Respiratory: ["Hospital / Clinic", "Care Home / Care Group"],
  "Wound Care": ["Hospital / Clinic", "Care Home / Care Group"],
  Sterilization: ["Hospital / Clinic", "Laboratory"],
  "Cleaning Robots": [
    "Hospitality",
    "Cleaning Company",
    "Facility Management",
    "Car Dealership",
    "Retail",
    "Hospital / Clinic",
  ],
  "Security Robots": ["Security Company", "Industrial Site", "Logistics", "Retail"],
  "Hospitality Robots": ["Hospitality", "Retail", "Car Dealership"],
  "Garden Robots": [
    "Municipality",
    "Facility Management",
    "Real Estate / Property Management",
    "Education / Campus",
    "Hospital / Clinic",
  ],
  "Agricultural Robots": ["Agriculture", "Municipality"],
  "Warehouse Robots": ["Logistics", "Industrial Site", "Retail", "Distributor / Wholesaler"],
  "Inspection Robots": ["Industrial Site", "Facility Management", "Logistics"],
  "Spare Parts": ["Cleaning Company", "Facility Management", "Hospitality", "Industrial Site"],
  Batteries: ["Cleaning Company", "Facility Management", "Logistics"],
  Sensors: ["Industrial Site", "Security Company", "Logistics"],
  Brushes: ["Cleaning Company", "Facility Management"],
  "Service Packages": ["Facility Management", "Hospitality", "Cleaning Company"],
};

const CHANNEL_INDUSTRY_BOOST: Record<string, Industry[]> = {
  Hospitals: ["Hospital / Clinic"],
  "Care Homes": ["Care Home / Care Group"],
  Laboratories: ["Laboratory"],
  "Public Sector": ["Public Sector", "Municipality"],
  Hospitality: ["Hospitality"],
  "Cleaning Companies": ["Cleaning Company"],
  "Facility Management": ["Facility Management"],
  "Car Dealerships": ["Car Dealership"],
  Municipalities: ["Municipality"],
  Agriculture: ["Agriculture"],
  "Security Companies": ["Security Company"],
  Retail: ["Retail"],
  Logistics: ["Logistics"],
  "Industrial Sites": ["Industrial Site"],
};

export function getProductIndustries(product: Product): {
  primary: Industry[];
  secondary: Industry[];
} {
  const primary = CATEGORY_PRIMARY_INDUSTRIES[product.category] ?? [];
  const fromChannels = product.salesChannels.flatMap(
    (c) => CHANNEL_INDUSTRY_BOOST[c] ?? []
  );
  const combined = [...new Set([...primary, ...fromChannels])];
  const secondary = combined.filter((i) => !primary.includes(i)).slice(0, 6);
  return { primary: primary.slice(0, 5), secondary };
}

export function getIndustryRelevanceScore(
  product: Product,
  industry: Industry
): number {
  const { primary, secondary } = getProductIndustries(product);
  if (primary.includes(industry)) return 85 + (product.stock % 15);
  if (secondary.includes(industry)) return 55 + (product.stock % 20);
  if (product.category === "Garden Robots" && industry === "Hospital / Clinic") return 35;
  if (product.vertical === "medical" && industry.includes("Hospital")) return 40;
  return 15 + (product.id.charCodeAt(0) % 25);
}

export type RelevanceBadgeType =
  | "recommended"
  | "often_purchased"
  | "facility"
  | "outdoor"
  | "service_region"
  | "leasing"
  | "frequently_leased"
  | "ai_recommended";

export function getRelevanceBadge(
  product: Product,
  industry: Industry,
  score: number
): { type: RelevanceBadgeType; label: string } | null {
  if (score >= 80) {
    return { type: "recommended", label: "Recommended for your industry" };
  }
  if (score >= 65 && industry === "Hospital / Clinic") {
    return { type: "often_purchased", label: "Often purchased by hospitals" };
  }
  if (score >= 60 && ["Facility Management", "Cleaning Company"].includes(industry)) {
    return { type: "facility", label: "Suitable for facility management" };
  }
  if (product.category === "Garden Robots" && score >= 30) {
    return { type: "outdoor", label: "Relevant for outdoor operations" };
  }
  if (product.serviceCoverage && score >= 50) {
    return { type: "service_region", label: "Service available in your region" };
  }
  if (product.financeAvailable && score >= 55) {
    return { type: "leasing", label: "Leasing available" };
  }
  if (product.financeAvailable && score >= 45) {
    return { type: "frequently_leased", label: "Frequently leased by similar companies" };
  }
  if (score >= 75) {
    return { type: "ai_recommended", label: "AI recommended" };
  }
  return null;
}

export function sortProductsByRelevance(
  products: Product[],
  industry: Industry,
  showRelevantFirst: boolean
): Product[] {
  const scored = products.map((p) => ({
    product: p,
    score: getIndustryRelevanceScore(p, industry),
  }));
  if (showRelevantFirst) {
    scored.sort((a, b) => b.score - a.score);
  }
  return scored.map((s) => s.product);
}

export function getIndustryUseCases(product: Product): string[] {
  const { primary } = getProductIndustries(product);
  return primary.slice(0, 3).map((i) => `${product.category} for ${i}`);
}

export function getRecommendedCategories(industry: Industry, vertical: Vertical): string[] {
  const medicalMap: Partial<Record<Industry, string[]>> = {
    "Hospital / Clinic": ["PPE", "Monitoring", "Diagnostics", "Consumables"],
    "Care Home / Care Group": ["Care Equipment", "Hygiene", "PPE", "Consumables"],
    Laboratory: ["Laboratory", "Diagnostics", "Consumables"],
    Hospitality: ["Hygiene", "Cleaning Robots", "Hospitality Robots"],
    "Cleaning Company": ["Cleaning Robots", "Spare Parts", "Service Packages"],
    "Facility Management": ["Cleaning Robots", "Inspection Robots", "Service Packages"],
    "Car Dealership": ["Cleaning Robots", "Hospitality Robots"],
  };
  const roboticsMap: Partial<Record<Industry, string[]>> = {
    Hospitality: ["Cleaning Robots", "Hospitality Robots", "Service Packages"],
    "Cleaning Company": ["Cleaning Robots", "Spare Parts", "Brushes"],
    "Facility Management": ["Cleaning Robots", "Inspection Robots", "Warehouse Robots"],
    Municipality: ["Garden Robots", "Cleaning Robots", "Security Robots"],
    "Car Dealership": ["Cleaning Robots", "Hospitality Robots"],
  };
  const map = vertical === "medical" ? medicalMap : roboticsMap;
  return map[industry] ?? (vertical === "medical" ? ["PPE", "Consumables"] : ["Cleaning Robots"]);
}
