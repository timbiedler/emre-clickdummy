import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { GrowthBundle, GrowthVertical } from "./growth-types";

const medicalBundles = [
  "Critical Care Monitoring Pack",
  "Diagnostic Imaging Starter",
  "Lab Automation Suite",
  "Patient Transport & Logistics",
  "Sterilization Modernization",
];

const roboticsBundles = [
  "Hospitality Cleaning Fleet",
  "FM Autonomous Patrol Pack",
  "Warehouse AMR Starter",
  "Municipal Outdoor Maintenance",
  "Dealership Service Robotics",
];

export const growthBundles: GrowthBundle[] = Array.from({ length: 30 }, (_, i) => {
  const vertical: GrowthVertical = i < 15 ? "medical" : "robotics";
  const names = vertical === "medical" ? medicalBundles : roboticsBundles;
  const base = 45000 + (i % 10) * 12000;
  return {
    id: `bnd-${String(i + 1).padStart(3, "0")}`,
    name: `${pick(names, i)} ${i % 3 === 0 ? "Pro" : "Standard"}`,
    vertical,
    products: [
      `${vertical === "medical" ? "Device" : "Robot"} A-${i}`,
      `${vertical === "medical" ? "Accessory" : "Dock"} B-${i}`,
      `Service tier ${1 + (i % 3)}`,
    ],
    includesService: i % 2 === 0,
    includesWarranty: true,
    includesInsurance: i % 3 !== 0,
    includesLeasing: i % 4 !== 1,
    includesFinancing: i % 5 !== 2,
    includesTraining: i % 3 === 0,
    listPrice: base,
    leasingRateMonthly: Math.round(base / 48),
    marginPercent: 18 + (i % 14),
    recommendedIndustries:
      vertical === "medical"
        ? ["Hospitals", "Clinics", "Labs"]
        : ["Hotels", "FM", "Logistics", "Municipalities"],
    recommendedTerritories: [pick(COUNTRIES, i), pick(COUNTRIES, i + 7), pick(COUNTRIES, i + 11)],
  };
});
