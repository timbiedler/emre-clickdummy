import type {
  Country,
  NetworkEntity,
  NetworkIntelligenceRegion,
  NetworkRoute,
  Vertical,
} from "./types";
import type { EuRegionKey } from "./eu-regions";
import { countryMatchesRegion } from "./eu-regions";
import { COUNTRIES } from "./constants";

const cities: { city: string; region: string; country: Country; lat: number; lng: number }[] = [
  { city: "Berlin", region: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Munich", region: "Bavaria", country: "Germany", lat: 48.135, lng: 11.582 },
  { city: "Hamburg", region: "Hamburg", country: "Germany", lat: 53.551, lng: 9.994 },
  { city: "Frankfurt", region: "Hesse", country: "Germany", lat: 50.11, lng: 8.682 },
  { city: "Cologne", region: "NRW", country: "Germany", lat: 50.938, lng: 6.96 },
  { city: "Vienna", region: "Vienna", country: "Austria", lat: 48.208, lng: 16.373 },
  { city: "Zurich", region: "Zurich", country: "Switzerland", lat: 47.376, lng: 8.541 },
  { city: "Paris", region: "Île-de-France", country: "France", lat: 48.856, lng: 2.352 },
  { city: "Lyon", region: "Auvergne-Rhône-Alpes", country: "France", lat: 45.764, lng: 4.836 },
  { city: "Madrid", region: "Madrid", country: "Spain", lat: 40.417, lng: -3.704 },
  { city: "Barcelona", region: "Catalonia", country: "Spain", lat: 41.387, lng: 2.168 },
  { city: "Milan", region: "Lombardy", country: "Italy", lat: 45.464, lng: 9.19 },
  { city: "Rome", region: "Lazio", country: "Italy", lat: 41.903, lng: 12.496 },
  { city: "Warsaw", region: "Mazovia", country: "Poland", lat: 52.229, lng: 21.012 },
  { city: "Amsterdam", region: "North Holland", country: "Netherlands", lat: 52.367, lng: 4.904 },
  { city: "Brussels", region: "Brussels", country: "Belgium", lat: 50.85, lng: 4.351 },
  { city: "Copenhagen", region: "Capital Region", country: "Denmark", lat: 55.676, lng: 12.568 },
  { city: "Stockholm", region: "Stockholm", country: "Sweden", lat: 59.329, lng: 18.068 },
  { city: "Oslo", region: "Oslo", country: "Norway", lat: 59.913, lng: 10.752 },
  { city: "Helsinki", region: "Uusimaa", country: "Finland", lat: 60.169, lng: 24.938 },
  { city: "Tallinn", region: "Harju", country: "Estonia", lat: 59.437, lng: 24.753 },
  { city: "Riga", region: "Riga", country: "Latvia", lat: 56.949, lng: 24.105 },
  { city: "Vilnius", region: "Vilnius", country: "Lithuania", lat: 54.687, lng: 25.279 },
  { city: "Prague", region: "Prague", country: "Czech Republic", lat: 50.075, lng: 14.437 },
  { city: "Bratislava", region: "Bratislava", country: "Slovakia", lat: 48.148, lng: 17.107 },
  { city: "Budapest", region: "Central Hungary", country: "Hungary", lat: 47.497, lng: 19.04 },
  { city: "Bucharest", region: "Bucharest", country: "Romania", lat: 44.426, lng: 26.102 },
  { city: "Sofia", region: "Sofia", country: "Bulgaria", lat: 42.698, lng: 23.322 },
];

const supplierNames = [
  "NordMed Manufacturing",
  "Alpine Diagnostics GmbH",
  "EuroSupply Wholesale",
  "Continental Med Import",
  "RoboTech Industries",
  "CleanBot Manufacturing",
  "ServoParts EU",
  "MediWholesale Benelux",
];

const dealerNames = [
  "MedEquip Partners",
  "RoboServe Distribution",
  "FacilityBot Resellers",
  "CareSupply Partners",
  "AutoClean Dealers EU",
  "TechServe Retail Network",
];

const customerNames = [
  "Charité Procurement",
  "Vienna General Hospital",
  "Municipality of Lyon",
  "CareGroup Nord",
  "LabPrecision Diagnostics",
  "Grand Hotel Group",
  "CleanPro Facility Services",
  "Industrial Park Munich",
  "Stockholm Care Consortium",
];

const serviceNames = [
  "MedService Berlin",
  "RoboTech Field Service",
  "InstallPro Partners",
  "SpareHub Central EU",
  "Maintenance365",
  "Emergency Med Supply",
];

const financeNames = [
  "LeaseLine Europe",
  "CapitalFlow Leasing",
  "FineTrade Partners",
  "MedFinance Solutions",
  "RoboLease AG",
];

const showroomNames = [
  "RoboExperience Munich",
  "CleanTech Demo Center",
  "MedDevice Showroom Paris",
  "Automation Experience Hub",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function entityBase(
  id: string,
  name: string,
  role: NetworkEntity["role"],
  subtype: string,
  vertical: Vertical | "both",
  loc: (typeof cities)[0],
  i: number
): NetworkEntity {
  return {
    id,
    name,
    role,
    subtype,
    vertical,
    country: loc.country,
    region: loc.region,
    city: loc.city,
    lat: loc.lat + (i % 5) * 0.08 - 0.16,
    lng: loc.lng + (i % 7) * 0.06 - 0.18,
    active: i % 11 !== 0,
    responseTime: pick(["< 2h", "< 4h", "< 8h", "24h"], i),
    certifications: pick(
      [
        ["ISO 13485", "MDR"],
        ["ISO 9001", "CE"],
        ["ISO 27001"],
        ["TÜV Certified"],
      ],
      i
    ),
    categories: pick(
      [
        ["Diagnostics", "PPE"],
        ["Cleaning Robots", "Spare Parts"],
        ["Laboratory", "Consumables"],
        ["Facility Management"],
      ],
      i
    ),
    serviceTypes: pick(
      [
        ["Installation", "Maintenance"],
        ["On-site repair", "Remote support"],
        ["Spare parts logistics"],
        ["Emergency supply"],
      ],
      i
    ),
    serviceLevel: pick(["Gold", "Silver", "Standard"], i),
    coverageArea: `${loc.region} · ${loc.country}`,
    contactEmail: `contact@${name.toLowerCase().replace(/\s+/g, "")}.eu`,
    contactPhone: `+49 ${30 + (i % 60)} ${100 + i} ${2000 + i}`,
    products: 12 + (i % 80),
    activeRfqs: i % 8,
    activeOrders: 2 + (i % 15),
    serviceTickets: i % 6,
    financeAvailable: i % 3 !== 0,
  };
}

const entities: NetworkEntity[] = [];
let idx = 0;

for (let i = 0; i < 24; i++) {
  const loc = cities[i % cities.length];
  entities.push(
    entityBase(
      `sup-${i}`,
      pick(supplierNames, i),
      "supplier",
      pick(["manufacturer", "distributor", "importer", "wholesaler"], i),
      i % 3 === 0 ? "both" : i % 2 === 0 ? "medical" : "robotics",
      loc,
      idx++
    )
  );
}

for (let i = 0; i < 20; i++) {
  const loc = cities[(i + 3) % cities.length];
  entities.push(
    entityBase(
      `deal-${i}`,
      pick(dealerNames, i),
      "dealer",
      pick(["reseller", "distribution_partner", "retail_partner"], i),
      i % 2 === 0 ? "robotics" : "both",
      loc,
      idx++
    )
  );
}

for (let i = 0; i < 28; i++) {
  const loc = cities[(i + 5) % cities.length];
  entities.push(
    entityBase(
      `cust-${i}`,
      pick(customerNames, i),
      "customer",
      pick(
        [
          "hospital",
          "care_group",
          "laboratory",
          "municipality",
          "hospitality_group",
          "cleaning_company",
          "industrial_site",
        ],
        i
      ),
      i % 3 === 0 ? "robotics" : "medical",
      loc,
      idx++
    )
  );
}

for (let i = 0; i < 18; i++) {
  const loc = cities[(i + 2) % cities.length];
  entities.push(
    entityBase(
      `svc-${i}`,
      pick(serviceNames, i),
      "service",
      pick(
        ["service_partner", "technician", "installation", "maintenance", "spare_parts_hub"],
        i
      ),
      i % 2 === 0 ? "both" : "robotics",
      loc,
      idx++
    )
  );
}

for (let i = 0; i < 12; i++) {
  const loc = cities[(i + 7) % cities.length];
  entities.push(
    entityBase(
      `fin-${i}`,
      pick(financeNames, i),
      "finance",
      pick(["leasing_partner", "financing_partner", "finetrading_partner"], i),
      "both",
      loc,
      idx++
    )
  );
}

for (let i = 0; i < 10; i++) {
  const loc = cities[(i + 9) % cities.length];
  entities.push(
    entityBase(
      `show-${i}`,
      pick(showroomNames, i),
      "showroom",
      pick(["showroom", "demo_center", "experience_center"], i),
      "robotics",
      loc,
      idx++
    )
  );
}

export const networkEntities = entities;

export const networkRoutes: NetworkRoute[] = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `route-sd-${i}`,
    fromId: `sup-${i}`,
    toId: `deal-${i % 20}`,
    type: "supplier_dealer" as const,
    vertical: (i % 2 === 0 ? "medical" : "robotics") as Vertical | "both",
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `route-dc-${i}`,
    fromId: `deal-${i}`,
    toId: `cust-${i}`,
    type: "dealer_customer" as const,
    vertical: (i % 3 === 0 ? "both" : i % 2 === 0 ? "robotics" : "medical") as Vertical | "both",
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `route-wc-${i}`,
    fromId: `sup-${i + 5}`,
    toId: `cust-${i + 10}`,
    type: "warehouse_customer" as const,
    vertical: "both" as const,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `route-tech-${i}`,
    fromId: `svc-${i}`,
    toId: `cust-${i + 3}`,
    type: "technician" as const,
    vertical: "robotics" as const,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `route-sp-${i}`,
    fromId: `svc-${i + 10}`,
    toId: `svc-${i}`,
    type: "spare_parts" as const,
    vertical: "robotics" as const,
  })),
];

export const networkIntelligence: NetworkIntelligenceRegion[] = COUNTRIES.map(
  (country, i) => ({
    region: pick(["North", "South", "Central", "Coastal"], i),
    country,
    demandScore: 55 + (i * 7) % 45,
    rfqDensity: 12 + (i * 3) % 28,
    orderVolume: 80 + (i * 11) % 120,
    serviceDemand: 20 + (i * 5) % 40,
    financeDemand: 15 + (i * 4) % 35,
    status: pick(["top", "emerging", "underserved", "stable"] as const, i),
  })
);

export function filterNetworkEntities(
  entities: NetworkEntity[],
  filters: {
    role?: string;
    country?: string;
    region?: EuRegionKey | "all";
    vertical?: Vertical | "both" | "all";
    activeOnly?: boolean;
    category?: string;
  }
): NetworkEntity[] {
  return entities.filter((e) => {
    if (filters.role && filters.role !== "all" && e.role !== filters.role) return false;
    if (filters.country && filters.country !== "all" && e.country !== filters.country)
      return false;
    if (filters.region && filters.region !== "all" && !countryMatchesRegion(e.country, filters.region))
      return false;
    if (
      filters.vertical &&
      filters.vertical !== "all" &&
      filters.vertical !== "both" &&
      e.vertical !== filters.vertical &&
      e.vertical !== "both"
    )
      return false;
    if (filters.activeOnly && !e.active) return false;
    if (
      filters.category &&
      filters.category !== "all" &&
      !e.categories.some((c) => c.toLowerCase().includes(filters.category!.toLowerCase()))
    )
      return false;
    return true;
  });
}
