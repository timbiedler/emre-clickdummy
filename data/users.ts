import type { UserRole } from "./types";
import { INDUSTRIES } from "./industries";
import { COUNTRIES } from "./constants";
import { pick } from "./generators";

const firstNames = [
  "Anna", "Thomas", "Sophie", "Marco", "Elena", "Jan", "Claire", "Piotr",
  "Lucas", "Maria", "Erik", "Fatima", "Henrik", "Isabelle", "Klaus",
];
const lastNames = [
  "Weber", "Schmidt", "Bernard", "Rossi", "Jansen", "Kowalski", "Müller",
  "Dupont", "Andersson", "Garcia", "Fischer", "Novak", "Larsen", "Moreau",
];

const roles: UserRole[] = [
  "admin", "customer", "customer", "customer", "supplier", "supplier",
  "dealer", "dealer", "sales_partner", "sales_partner", "service_partner",
  "finance_partner", "agency", "logistics", "customer", "admin",
  "customer", "dealer", "sales_partner", "service_partner", "supplier",
  "customer", "finance_partner", "agency", "logistics", "customer",
  "sales_partner", "dealer", "admin", "customer",
];

const companyNames = [
  "NordCare Procurement GmbH",
  "Alpine Hospital Supply",
  "EuroLab Diagnostics",
  "City Facility Services",
  "MedSupply Europa GmbH",
  "RoboServe Distribution",
  "CleanFleet Partners",
  "LeaseLine Finance AG",
  "CampaignWorks Agency",
  "Central Logistics EU",
  "CareGroup Nord",
  "Grand Hotel Group",
  "AutoClean Dealers",
  "FieldService Robotics",
  "PublicHealth Procurement",
  "Distribution Engine Ops",
  "Vienna General Procurement",
  "Benelux Med Wholesale",
  "RoboTech Resellers",
  "PartnerConnect Sales",
  "Maintenance365 Service",
  "CapitalFlow Leasing",
  "GrowthLab Marketing",
  "Fulfillment Hub Berlin",
  "Industrial Supply Co.",
];

export const companies = companyNames.slice(0, 25).map((name, i) => ({
  id: `co-${String(i + 1).padStart(3, "0")}`,
  name,
  role: pick(roles, i),
  primaryIndustry: INDUSTRIES[i % INDUSTRIES.length],
  secondaryIndustries: [
    INDUSTRIES[(i + 3) % INDUSTRIES.length],
    INDUSTRIES[(i + 7) % INDUSTRIES.length],
  ],
  country: COUNTRIES[i % COUNTRIES.length],
  region: pick(["North", "South", "Central", "Coastal"], i),
  companySize: pick(["1-50", "51-200", "201-1000", "1000+"] as const, i),
  preferredCategories: pick(
    [
      ["PPE", "Consumables"],
      ["Cleaning Robots", "Spare Parts"],
      ["Diagnostics", "Laboratory"],
      ["Care Equipment", "Hygiene"],
    ],
    i
  ),
  financeStatus: pick(
    ["pre_approved", "under_review", "documents_missing", "not_started"] as const,
    i
  ),
  serviceCoverageNeeds: pick(
    [["On-site maintenance"], ["Spare parts logistics"], ["Installation", "Training"]],
    i
  ),
  buyingBehavior: pick(
    ["Recurring procurement", "Project-based", "Fleet expansion", "Emergency supply"],
    i
  ),
  activeRfqs: (i % 6) + 1,
  openOrders: (i % 8) + 2,
}));

export const platformUsers = Array.from({ length: 30 }, (_, i) => {
  const company = companies[i % companies.length];
  const role = i < roles.length ? roles[i] : pick(roles, i);
  return {
    id: `usr-${String(i + 1).padStart(3, "0")}`,
    name: `${pick(firstNames, i)} ${pick(lastNames, i + 5)}`,
    email: `user${i + 1}@${company.name.toLowerCase().replace(/\s+/g, "").slice(0, 12)}.eu`,
    role,
    industry: company.primaryIndustry,
    secondaryIndustries: company.secondaryIndustries,
    companyId: company.id,
    companyName: company.name,
    country: company.country,
    region: company.region,
    status: pick(["active", "active", "active", "invited"] as const, i),
    lastLogin: pick(["2h ago", "Today", "Yesterday", "3 days ago"], i),
  };
});
