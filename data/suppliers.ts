import { COUNTRIES, MEDICAL_CHANNELS, ROBOTICS_CHANNELS } from "./constants";
import { localize, pick } from "./generators";
import type { Supplier } from "./types";

const medicalNames = [
  "MedSupply Europa GmbH",
  "SafeGuard Distribution AG",
  "EuroDiag Trading BV",
  "VitalCare Logistics SAS",
  "SteriTech Medical Sp. z o.o.",
  "NovaMed Supply Italia",
  "CareLine Procurement SE",
  "LabPrecision Nordic AB",
  "PublicHealth Supply GmbH",
  "EmergencyMed Partners",
];

const roboticsNames = [
  "RoboClean Distribution GmbH",
  "Nexus Robotics Europe BV",
  "AutoServe Benelux NV",
  "FieldBot DACH AG",
  "ServoTech Robotics S.L.",
  "AgriScan Distribution Sp. z o.o.",
  "SecurePatrol Europe SAS",
  "LogiMove Robotics AB",
  "HospitalityBot Partners",
  "CleanFleet Service GmbH",
];

export const suppliers: Supplier[] = [
  ...medicalNames.map((name, i) => ({
    id: `sup-${String(i + 1).padStart(2, "0")}`,
    name,
    vertical: "medical" as const,
    country: pick(COUNTRIES, i),
    rating: 4.2 + (i % 8) * 0.1,
    products: 12 + i * 3,
    responseTime: `${2 + (i % 6)}h`,
    complianceScore: 82 + (i % 15),
    onboardingStatus: pick(["approved", "review", "approved"] as const, i),
    salesChannels: [pick(MEDICAL_CHANNELS, i), pick(MEDICAL_CHANNELS, i + 2)],
    translationStatus: pick(["verified", "pending", "auto"] as const, i),
    description: localize(
      `Leading EU medical supply partner specializing in ${pick(MEDICAL_CHANNELS, i).toLowerCase()} distribution.`
    ),
  })),
  ...roboticsNames.map((name, i) => ({
    id: `sup-${String(i + 11).padStart(2, "0")}`,
    name,
    vertical: "robotics" as const,
    country: pick(COUNTRIES, i + 3),
    rating: 4.0 + (i % 9) * 0.1,
    products: 8 + i * 2,
    responseTime: `${4 + (i % 8)}h`,
    complianceScore: 78 + (i % 18),
    onboardingStatus: pick(["approved", "review", "pending"] as const, i),
    salesChannels: [pick(ROBOTICS_CHANNELS, i), pick(ROBOTICS_CHANNELS, i + 1)],
    translationStatus: pick(["verified", "auto", "pending"] as const, i),
    description: localize(
      `Authorized robotics distributor with showroom and service network across ${pick(COUNTRIES, i + 3)}.`
    ),
  })),
];
