import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { Buyer } from "./types";

const medicalBuyers = [
  "Universitätsklinikum München",
  "CareGroup Nord GmbH",
  "Labor Diagnostik Network",
  "Bundeswehr Medical Procurement",
  "Red Cross Supply Center",
  "Praxisverbund Rhein-Main",
  "TestLab Europe AG",
  "MedDistrib Süd GmbH",
  "Pflegeheim Alliance SE",
  "Public Health Authority NRW",
];

const roboticsBuyers = [
  "Hotel Group Alpine Resorts",
  "CleanPro Facility Services",
  "AutoPark Dealership Network",
  "City of Vienna Facilities",
  "AgriCoop Northern Europe",
  "SecureGuard Industrial",
  "RetailChain Logistics BV",
  "WarehousePro GmbH",
  "Municipal Services Barcelona",
  "Hospitality Partners Italia",
];

export const buyers: Buyer[] = [
  ...medicalBuyers.map((name, i) => ({
    id: `buy-${String(i + 1).padStart(2, "0")}`,
    name,
    vertical: "medical" as const,
    country: pick(COUNTRIES, i),
    type: pick(["Hospital", "Care Group", "Laboratory", "Public Sector", "Distributor"], i),
    activeRfqs: 1 + (i % 5),
    totalOrders: 12 + i * 7,
    creditStatus: pick(["approved", "review", "approved"] as const, i),
  })),
  ...roboticsBuyers.map((name, i) => ({
    id: `buy-${String(i + 11).padStart(2, "0")}`,
    name,
    vertical: "robotics" as const,
    country: pick(COUNTRIES, i + 2),
    type: pick(["Dealer", "Facility Manager", "Municipality", "Hospitality Group", "Industrial"], i),
    activeRfqs: 1 + (i % 4),
    totalOrders: 8 + i * 5,
    creditStatus: pick(["approved", "approved", "pending"] as const, i),
  })),
];
