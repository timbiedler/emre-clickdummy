import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { Servicepoint } from "./types";

const medicalTypes = [
  "Authorized Distributor",
  "Compliance Contact",
  "Device Service Partner",
  "Emergency Supply Partner",
  "Regional Warehouse",
];

const roboticsTypes = [
  "Authorized Dealer",
  "Showroom",
  "Spare Parts Hub",
  "Installation Partner",
  "Fleet Service Center",
  "Technician Hub",
];

export const servicepoints: Servicepoint[] = [
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `sp-${String(i + 1).padStart(3, "0")}`,
    vertical: "medical" as const,
    name: `${pick(["MedCare", "EuroSupply", "VitalPoint", "SafeMed"], i)} ${pick(COUNTRIES, i)}`,
    type: pick(medicalTypes, i),
    country: pick(COUNTRIES, i),
    region: pick(["North", "South", "East", "West", "Central"], i),
    categories: ["Diagnostics", "PPE", "Medical Devices"].slice(0, 1 + (i % 3)),
    serviceTypes: ["Distribution", "Compliance Support", "Emergency Supply"].slice(0, 1 + (i % 2)),
    responseTime: `${4 + (i % 12)}h`,
    certification: ["ISO 13485", "MDR Registered"],
    rating: 4.1 + (i % 9) * 0.1,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `sp-${String(i + 14).padStart(3, "0")}`,
    vertical: "robotics" as const,
    name: `${pick(["RoboHub", "ServoPoint", "CleanTech", "FieldBot"], i)} ${pick(COUNTRIES, i + 2)}`,
    type: pick(roboticsTypes, i),
    country: pick(COUNTRIES, i + 2),
    region: pick(["North", "South", "East", "West", "Central"], i),
    categories: ["Cleaning Robots", "Spare Parts", "Service Packages"].slice(0, 1 + (i % 3)),
    serviceTypes: ["Maintenance", "Spare Parts", "Showroom Demo", "Installation"].slice(0, 1 + (i % 3)),
    responseTime: `${2 + (i % 8)}h`,
    certification: ["CE Service Certified", "Manufacturer Authorized"],
    rating: 4.3 + (i % 7) * 0.1,
  })),
];
