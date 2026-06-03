import type { Country } from "@/data/types";

/** EU market regions for filters, reporting, and territory management */
export const EU_REGIONS = {
  nordics: ["Norway", "Finland", "Sweden", "Denmark"] as Country[],
  baltics: ["Estonia", "Latvia", "Lithuania"] as Country[],
  dach: ["Germany", "Austria", "Switzerland"] as Country[],
  benelux: ["Netherlands", "Belgium"] as Country[],
  western: ["France", "Spain", "Italy"] as Country[],
  central: ["Poland", "Czech Republic", "Slovakia", "Hungary"] as Country[],
  eastern: ["Romania", "Bulgaria"] as Country[],
} as const;

export type EuRegionKey = keyof typeof EU_REGIONS;

export const EU_REGION_LABELS: Record<EuRegionKey, string> = {
  nordics: "Nordics",
  baltics: "Baltics",
  dach: "DACH",
  benelux: "Benelux",
  western: "Western EU",
  central: "Central EU",
  eastern: "Eastern EU",
};

export function getRegionForCountry(country: Country): EuRegionKey | null {
  for (const [key, list] of Object.entries(EU_REGIONS) as [EuRegionKey, Country[]][]) {
    if (list.includes(country)) return key;
  }
  return null;
}

export function countriesInRegion(region: EuRegionKey | "all"): Country[] {
  if (region === "all") return [];
  return [...EU_REGIONS[region]];
}

export function countryMatchesRegion(country: Country, region: string): boolean {
  if (region === "all") return true;
  if (region in EU_REGIONS) {
    return EU_REGIONS[region as EuRegionKey].includes(country);
  }
  return country === region;
}

/** Per-country coverage & performance metrics for map and admin */
export interface CountryMarketStats {
  country: Country;
  region: EuRegionKey;
  supplierCount: number;
  dealerCount: number;
  serviceCoverage: number;
  financeCoverage: number;
  salesPartnerCount: number;
  rfqVolume: number;
  orderVolume: number;
  expansionScore: number;
  status: "top" | "growing" | "underserved" | "stable";
}

export const countryMarketStats: CountryMarketStats[] = [
  { country: "Germany", region: "dach", supplierCount: 48, dealerCount: 32, serviceCoverage: 92, financeCoverage: 88, salesPartnerCount: 12, rfqVolume: 234, orderVolume: 890, expansionScore: 72, status: "top" },
  { country: "Austria", region: "dach", supplierCount: 18, dealerCount: 14, serviceCoverage: 85, financeCoverage: 82, salesPartnerCount: 5, rfqVolume: 78, orderVolume: 210, expansionScore: 68, status: "growing" },
  { country: "Switzerland", region: "dach", supplierCount: 15, dealerCount: 11, serviceCoverage: 88, financeCoverage: 90, salesPartnerCount: 4, rfqVolume: 65, orderVolume: 185, expansionScore: 70, status: "stable" },
  { country: "Netherlands", region: "benelux", supplierCount: 22, dealerCount: 18, serviceCoverage: 90, financeCoverage: 86, salesPartnerCount: 6, rfqVolume: 112, orderVolume: 340, expansionScore: 75, status: "top" },
  { country: "Belgium", region: "benelux", supplierCount: 14, dealerCount: 10, serviceCoverage: 84, financeCoverage: 80, salesPartnerCount: 3, rfqVolume: 58, orderVolume: 165, expansionScore: 62, status: "growing" },
  { country: "France", region: "western", supplierCount: 35, dealerCount: 28, serviceCoverage: 87, financeCoverage: 84, salesPartnerCount: 9, rfqVolume: 178, orderVolume: 520, expansionScore: 78, status: "top" },
  { country: "Spain", region: "western", supplierCount: 24, dealerCount: 19, serviceCoverage: 82, financeCoverage: 79, salesPartnerCount: 6, rfqVolume: 95, orderVolume: 280, expansionScore: 71, status: "growing" },
  { country: "Italy", region: "western", supplierCount: 28, dealerCount: 22, serviceCoverage: 83, financeCoverage: 81, salesPartnerCount: 7, rfqVolume: 102, orderVolume: 310, expansionScore: 69, status: "growing" },
  { country: "Poland", region: "central", supplierCount: 26, dealerCount: 20, serviceCoverage: 80, financeCoverage: 76, salesPartnerCount: 8, rfqVolume: 118, orderVolume: 295, expansionScore: 74, status: "top" },
  { country: "Czech Republic", region: "central", supplierCount: 12, dealerCount: 9, serviceCoverage: 78, financeCoverage: 74, salesPartnerCount: 3, rfqVolume: 42, orderVolume: 120, expansionScore: 65, status: "growing" },
  { country: "Slovakia", region: "central", supplierCount: 8, dealerCount: 6, serviceCoverage: 72, financeCoverage: 70, salesPartnerCount: 2, rfqVolume: 28, orderVolume: 78, expansionScore: 58, status: "growing" },
  { country: "Hungary", region: "central", supplierCount: 10, dealerCount: 8, serviceCoverage: 74, financeCoverage: 71, salesPartnerCount: 2, rfqVolume: 35, orderVolume: 95, expansionScore: 60, status: "growing" },
  { country: "Romania", region: "eastern", supplierCount: 9, dealerCount: 7, serviceCoverage: 68, financeCoverage: 65, salesPartnerCount: 2, rfqVolume: 32, orderVolume: 88, expansionScore: 55, status: "underserved" },
  { country: "Bulgaria", region: "eastern", supplierCount: 6, dealerCount: 5, serviceCoverage: 64, financeCoverage: 62, salesPartnerCount: 1, rfqVolume: 22, orderVolume: 62, expansionScore: 48, status: "underserved" },
  { country: "Norway", region: "nordics", supplierCount: 11, dealerCount: 8, serviceCoverage: 86, financeCoverage: 84, salesPartnerCount: 3, rfqVolume: 48, orderVolume: 142, expansionScore: 66, status: "growing" },
  { country: "Finland", region: "nordics", supplierCount: 10, dealerCount: 7, serviceCoverage: 84, financeCoverage: 82, salesPartnerCount: 2, rfqVolume: 38, orderVolume: 110, expansionScore: 63, status: "growing" },
  { country: "Sweden", region: "nordics", supplierCount: 16, dealerCount: 12, serviceCoverage: 88, financeCoverage: 85, salesPartnerCount: 4, rfqVolume: 72, orderVolume: 205, expansionScore: 70, status: "top" },
  { country: "Denmark", region: "nordics", supplierCount: 13, dealerCount: 10, serviceCoverage: 87, financeCoverage: 83, salesPartnerCount: 3, rfqVolume: 55, orderVolume: 158, expansionScore: 67, status: "stable" },
  { country: "Estonia", region: "baltics", supplierCount: 5, dealerCount: 4, serviceCoverage: 70, financeCoverage: 68, salesPartnerCount: 1, rfqVolume: 18, orderVolume: 52, expansionScore: 52, status: "underserved" },
  { country: "Latvia", region: "baltics", supplierCount: 4, dealerCount: 3, serviceCoverage: 68, financeCoverage: 66, salesPartnerCount: 1, rfqVolume: 15, orderVolume: 45, expansionScore: 50, status: "underserved" },
  { country: "Lithuania", region: "baltics", supplierCount: 6, dealerCount: 5, serviceCoverage: 71, financeCoverage: 69, salesPartnerCount: 2, rfqVolume: 24, orderVolume: 68, expansionScore: 54, status: "growing" },
];

export function getCountryStats(country: Country): CountryMarketStats | undefined {
  return countryMarketStats.find((s) => s.country === country);
}
