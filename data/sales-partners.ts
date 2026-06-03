import type {
  CommissionModel,
  Country,
  SalesPartner,
  SalesPartnerApplication,
  SalesTerritory,
} from "./types";
import { INDUSTRIES } from "./industries";
import { COUNTRIES, MEDICAL_CATEGORIES, ROBOTICS_CATEGORIES } from "./constants";
import { pick } from "./generators";

const partnerNames = [
  "MedEquip Partners DACH",
  "RoboServe Benelux",
  "CareSupply Regional",
  "FacilityBot Resellers",
  "Alpine Sales Network",
  "Nordic Distribution Partners",
  "EuroRobotics Dealers",
  "PublicSector Supply Partners",
  "HospitalityBot Partners",
  "CleanTech Channel EU",
  "LabPrecision Partners",
  "Industrial Automation Sales",
  "ShowroomConnect EU",
  "Vertical Specialists GmbH",
  "CrossBorder Med Sales",
];

export const salesPartners: SalesPartner[] = partnerNames.map((name, i) => ({
  id: `sp-${String(i + 1).padStart(3, "0")}`,
  name,
  type: pick(
    ["regional sales partner", "dealer", "distributor", "showroom partner", "vertical specialist"],
    i
  ),
  countries: [COUNTRIES[i % COUNTRIES.length], COUNTRIES[(i + 2) % COUNTRIES.length]],
  regions: [pick(["North", "South", "Central"], i), pick(["Coastal", "Metro"], i + 1)],
  industries: [
    INDUSTRIES[i % INDUSTRIES.length],
    INDUSTRIES[(i + 4) % INDUSTRIES.length],
  ],
  categories: pick(
    [
      MEDICAL_CATEGORIES.slice(0, 4),
      ROBOTICS_CATEGORIES.slice(0, 4),
      [...MEDICAL_CATEGORIES.slice(0, 2), ...ROBOTICS_CATEGORIES.slice(0, 2)],
    ],
    i
  ),
  salesChannels: pick(
    [["Hospitals", "Care Homes"], ["Hospitality", "Cleaning Companies"], ["Retail", "Facility Management"]],
    i
  ),
  showroomAvailable: i % 3 !== 0,
  serviceCapabilities: pick(
    [["Installation"], ["Maintenance", "Training"], ["Spare parts logistics"]],
    i
  ),
  financeReadiness: pick(["ready", "in_progress", "not_started"] as const, i),
  contractStatus: pick(["active", "pending", "draft"] as const, i),
  approvalStatus: pick(["approved", "approved", "review"] as const, i),
  assignedLeads: 5 + (i % 20),
  pipelineValue: 120000 + i * 45000,
  commissionModel: pick(["Standard 8%", "Volume tier 6–10%", "Category bonus 12%"], i),
  performanceScore: 72 + (i % 25),
}));

const applicantNames = [
  "Regional Med Sales GmbH",
  "RoboChannel Austria",
  "CarePartners France",
  "FacilitySales Nordics",
  "DealerConnect Poland",
  "Showroom Robotics Italy",
  "Vertical Health Partners",
  "CleanBot Reseller EU",
  "LabSupply Partners",
  "IndustrialBot Channel",
  "Hospitality Robotics Sales",
  "Public Procurement Partners",
];

export const salesPartnerApplications: SalesPartnerApplication[] = applicantNames.map(
  (companyName, i) => ({
    id: `spa-${String(i + 1).padStart(3, "0")}`,
    companyName,
    contactName: pick(["Michael Braun", "Sarah Chen", "Jean Dupont", "Eva Novak"], i),
    email: `apply@${companyName.toLowerCase().replace(/\s+/g, "").slice(0, 14)}.eu`,
    countries: [COUNTRIES[i % COUNTRIES.length]],
    industries: [INDUSTRIES[i % INDUSTRIES.length], INDUSTRIES[(i + 2) % INDUSTRIES.length]],
    categories: pick([MEDICAL_CATEGORIES.slice(0, 3), ROBOTICS_CATEGORIES.slice(0, 3)], i),
    salesChannels: pick([["Hospitals"], ["Hospitality"], ["Facility Management"]], i),
    showroomAvailable: i % 2 === 0,
    serviceCapabilities: pick([["Installation"], ["Maintenance"], []], i),
    financeReadiness: pick(["Ready for leasing sales", "In training", "Not started"], i),
    documentStatus: pick(["complete", "partial", "missing"] as const, i),
    contractStatus: pick(["unsigned", "sent", "signed"] as const, i),
    approvalStatus: pick(["pending", "review", "approved", "rejected"] as const, i),
    submittedAt: pick(["2026-05-28", "2026-05-30", "2026-06-01", "2026-06-02"], i),
    step: Math.min(12, 3 + (i % 10)),
  })
);

export const commissionModels: CommissionModel[] = Array.from({ length: 10 }, (_, i) => ({
  id: `cm-${i + 1}`,
  name: pick(
    ["Standard reseller", "Volume tier", "Category specialist", "Regional exclusive", "Showroom bonus"],
    i
  ),
  type: pick(["percentage", "fixed + bonus", "tiered"], i),
  rate: pick(["6%", "8%", "10%", "6–12% tiered"], i),
  categories: pick([MEDICAL_CATEGORIES.slice(0, 2), ROBOTICS_CATEGORIES.slice(0, 2)], i),
  regions: [pick(["DACH", "Benelux", "Nordics", "Southern EU"], i)],
}));

export const salesTerritories: SalesTerritory[] = Array.from({ length: 15 }, (_, i) => {
  const partner = salesPartners[i % salesPartners.length];
  return {
    id: `st-${i + 1}`,
    partnerId: partner.id,
    partnerName: partner.name,
    country: COUNTRIES[i % COUNTRIES.length] as Country,
    region: pick(["North", "South", "Central", "Metro"], i),
    industries: [INDUSTRIES[i % INDUSTRIES.length]],
    categories: partner.categories.slice(0, 2),
  };
});

export function getSalesPartnerById(id: string): SalesPartner | undefined {
  return salesPartners.find((p) => p.id === id);
}
