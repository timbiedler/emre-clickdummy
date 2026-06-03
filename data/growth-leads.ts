import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { GrowthLead, GrowthVertical, LeadIndustryType, LeadStatus } from "./growth-types";

const medicalTypes: LeadIndustryType[] = [
  "hospital",
  "clinic",
  "care_home",
  "lab",
  "practice",
  "public_sector",
  "ngo",
  "distributor",
];

const roboticsTypes: LeadIndustryType[] = [
  "hotel",
  "cleaning",
  "facility_management",
  "car_dealer",
  "municipality",
  "agriculture",
  "security",
  "logistics",
  "industrial",
];

const medicalCompanies = [
  "Riverside University Hospital",
  "NordCare Clinic Group",
  "Alpine Senior Living",
  "Metro Diagnostics Lab",
  "City Health Practice Network",
  "Regional Procurement Office",
  "MedAid Foundation",
  "EuroMed Distributors",
];

const roboticsCompanies = [
  "Grand Plaza Hotels",
  "CleanPro Facility Services",
  "AutoMotion Dealership Group",
  "City of North Harbor",
  "AgriTech Cooperative",
  "SecureGuard Operations",
  "LogiFlow Warehousing",
  "Industrial Motion GmbH",
];

const sources = ["Web form", "Trade fair", "Partner referral", "Signal engine", "Google Ads", "Showroom QR", "API webhook"];
const signals = ["Expansion notice", "Tender published", "Hiring spike", "Service contract ending", "Financing search", "Category trend"];
const statuses: LeadStatus[] = ["new", "qualified", "nurturing", "assigned", "converted", "disqualified"];
const owners = ["Platform SDR", "DACH Partner Desk", "Benelux Partner", "Nordic Inside Sales", "Unassigned"];
const campaigns = ["Q2 Hospital Outreach", "FM Robotics Sprint", "Leasing-first nurture", "Showroom follow-up", "DACH Google test"];

const cities = ["Berlin", "Paris", "Amsterdam", "Warsaw", "Milan", "Madrid", "Vienna", "Stockholm", "Prague", "Brussels"];

export const growthLeads: GrowthLead[] = Array.from({ length: 100 }, (_, i) => {
  const vertical: GrowthVertical = i % 3 === 0 ? "robotics" : "medical";
  const types = vertical === "medical" ? medicalTypes : roboticsTypes;
  const names = vertical === "medical" ? medicalCompanies : roboticsCompanies;
  const industry = pick(types, i);
  return {
    id: `lead-${String(i + 1).padStart(4, "0")}`,
    company: `${pick(names, i)} ${i > 50 ? "EU" : ""}`.trim(),
    industry,
    vertical,
    country: pick(COUNTRIES, i),
    city: pick(cities, i + 3),
    size: pick(["smb", "mid", "enterprise"] as const, i),
    fitScore: 62 + (i % 35),
    productFit:
      vertical === "medical"
        ? ["Diagnostic imaging", "Patient monitoring", "Lab automation"].slice(0, 1 + (i % 3))
        : ["Cleaning robots", "AMR logistics", "Security patrol"].slice(0, 1 + (i % 3)),
    financePotential: pick(["low", "medium", "high"] as const, i),
    serviceCoverage: 55 + (i % 45),
    source: pick(sources, i),
    signal: pick(signals, i + 1),
    status: pick(statuses, i),
    owner: pick(owners, i),
    suggestedCampaign: pick(campaigns, i),
  };
});
