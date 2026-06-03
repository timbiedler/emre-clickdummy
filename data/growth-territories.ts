import { countryMarketStats } from "./eu-regions";
import { salesPartners } from "./sales-partners";
import { pick } from "./generators";
import type { GrowthTerritory } from "./growth-types";

const cityPools: Record<string, string[]> = {
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  France: ["Paris", "Lyon", "Marseille"],
  Poland: ["Warsaw", "Kraków", "Wrocław"],
  default: ["Capital", "Metro North", "Coastal Hub"],
};

const actions = [
  "Launch DACH email nurture",
  "Assign regional sales partner",
  "Open Google Ads test in territory",
  "Prepare bundle + leasing landingpage",
  "Convert white spots to partner outreach",
  "Schedule showroom activation",
];

export const growthTerritories: GrowthTerritory[] = countryMarketStats.map((stats, i) => {
  const cities = cityPools[stats.country] ?? cityPools.default;
  return {
    id: `ter-${String(i + 1).padStart(3, "0")}`,
    country: stats.country,
    region: stats.region,
    cities: cities.slice(0, 3),
    industryDensity: 55 + (i % 40),
    customerPotential: 120 + stats.expansionScore * 4,
    buyerCount: stats.dealerCount * 8 + stats.supplierCount,
    salesPartnerCount: stats.salesPartnerCount,
    serviceCoverage: stats.serviceCoverage,
    financeCoverage: stats.financeCoverage,
    pipelineValue: stats.rfqVolume * 1200 + stats.orderVolume * 400,
    whiteSpots: stats.status === "underserved" ? 4 + (i % 5) : i % 3,
    expansionScore: stats.expansionScore,
    potentialCustomers: 40 + stats.expansionScore,
    leads: 8 + (i % 12),
    assignedPartner: pick(salesPartners, i).name,
    openRfqs: Math.max(1, Math.floor(stats.rfqVolume / 12)),
    offers: Math.max(2, Math.floor(stats.orderVolume / 40)),
    leasingPotential: stats.financeCoverage,
    recommendedAction: pick(actions, i + 2),
  };
});
