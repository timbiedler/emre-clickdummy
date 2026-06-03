import type { Industry, IndustryRfqTemplate, Vertical } from "./types";
import { INDUSTRIES } from "./industries";

const templateSeeds: { industry: Industry; title: string; description: string; categories: string[]; vertical: Vertical | "both" }[] = [
  { industry: "Hospital / Clinic", title: "Multi-department consumables replenishment", description: "Recurring supply for ER, ICU, and general wards with consolidated invoicing.", categories: ["Consumables", "PPE"], vertical: "medical" },
  { industry: "Hospital / Clinic", title: "Patient monitoring device comparison", description: "Compare monitoring devices with service SLA and leasing options.", categories: ["Monitoring", "Medical Devices"], vertical: "medical" },
  { industry: "Care Home / Care Group", title: "8-location hygiene and care supply", description: "Monthly consumables plan across care locations in Germany.", categories: ["Hygiene", "Care Equipment"], vertical: "medical" },
  { industry: "Care Home / Care Group", title: "Care bed fleet with leasing", description: "Compare care beds with 36-month leasing and installation.", categories: ["Care Equipment"], vertical: "medical" },
  { industry: "Laboratory", title: "Diagnostic reagents quarterly supply", description: "Laboratory consumables with cold-chain delivery requirements.", categories: ["Laboratory", "Diagnostics"], vertical: "medical" },
  { industry: "Public Sector", title: "Emergency medical reserve stock", description: "Public-sector compliant emergency supply with MDR documentation.", categories: ["Emergency Supply", "PPE"], vertical: "medical" },
  { industry: "Municipality", title: "Outdoor maintenance equipment", description: "Grounds maintenance including campus outdoor areas.", categories: ["Garden Robots", "Cleaning Robots"], vertical: "both" },
  { industry: "Hospitality", title: "12-hotel cleaning robot fleet", description: "Autonomous cleaning robots with unified service contract.", categories: ["Cleaning Robots", "Service Packages"], vertical: "robotics" },
  { industry: "Hospitality", title: "Hospitality robot service plan", description: "Service robots with leasing and multi-site maintenance.", categories: ["Hospitality Robots"], vertical: "robotics" },
  { industry: "Cleaning Company", title: "Mixed commercial building fleet", description: "Cleaning robots for office, retail, and healthcare clients.", categories: ["Cleaning Robots", "Spare Parts"], vertical: "robotics" },
  { industry: "Facility Management", title: "DACH service coverage comparison", description: "Compare robots with service coverage in Germany and Austria.", categories: ["Cleaning Robots", "Inspection Robots"], vertical: "robotics" },
  { industry: "Car Dealership", title: "Showroom floor cleaning robots", description: "Cleaning robots for showroom floors with leasing.", categories: ["Cleaning Robots"], vertical: "robotics" },
  { industry: "Car Dealership", title: "Multi-location service plan", description: "Maintenance package for dealership network.", categories: ["Service Packages", "Spare Parts"], vertical: "robotics" },
  { industry: "Industrial Site", title: "Warehouse inspection robots", description: "Inspection and warehouse robots for logistics hub.", categories: ["Inspection Robots", "Warehouse Robots"], vertical: "robotics" },
  { industry: "Security Company", title: "Patrol robot deployment", description: "Security robots with spare parts and SLA.", categories: ["Security Robots"], vertical: "robotics" },
  { industry: "Retail", title: "In-store cleaning automation", description: "Cleaning robots for retail chain with financing.", categories: ["Cleaning Robots"], vertical: "robotics" },
  { industry: "Logistics", title: "Warehouse automation RFQ", description: "Warehouse robots and spare parts hub integration.", categories: ["Warehouse Robots", "Spare Parts"], vertical: "robotics" },
  { industry: "Education / Campus", title: "Campus outdoor and indoor maintenance", description: "Garden and cleaning robots for university campus.", categories: ["Garden Robots", "Cleaning Robots"], vertical: "both" },
  { industry: "Real Estate / Property Management", title: "Property portfolio cleaning plan", description: "Fleet plan for mixed commercial properties.", categories: ["Cleaning Robots", "Service Packages"], vertical: "robotics" },
  { industry: "Doctor Practice", title: "Practice consumables subscription", description: "Recurring diagnostics and consumables for group practice.", categories: ["Consumables", "Diagnostics"], vertical: "medical" },
  { industry: "Distributor / Wholesaler", title: "Wholesale assortment expansion", description: "Bulk procurement with reseller pricing tiers.", categories: ["PPE", "Consumables"], vertical: "medical" },
  { industry: "Agriculture", title: "Field inspection robotics", description: "Agricultural robots with seasonal service plan.", categories: ["Agricultural Robots"], vertical: "robotics" },
];

export const industryRfqTemplates: IndustryRfqTemplate[] = templateSeeds.map((t, i) => ({
  id: `tpl-${String(i + 1).padStart(3, "0")}`,
  ...t,
}));

export const industryAiPrompts: Record<Industry, string[]> = {
  "Hospital / Clinic": [
    "We need recurring supply for multiple hospital departments.",
    "Compare patient monitoring devices with financing.",
    "Find service partners for medical devices.",
    "Show outdoor maintenance options for a clinic campus.",
  ],
  "Care Home / Care Group": [
    "Find recurring hygiene and care supply for 8 locations.",
    "Compare care beds with leasing options.",
    "Create a monthly consumables plan.",
  ],
  "Laboratory": [
    "Request quarterly diagnostic reagent supply with cold-chain delivery.",
    "Compare laboratory analyzers with service contracts.",
  ],
  "Public Sector": [
    "Emergency medical supply with public procurement compliance.",
    "Compare suppliers with verified MDR documentation.",
  ],
  Municipality: [
    "Outdoor maintenance robots for municipal facilities.",
    "Compare cleaning solutions for public buildings.",
  ],
  "Distributor / Wholesaler": [
    "Expand wholesale assortment with volume pricing.",
    "Compare supplier lead times across EU markets.",
  ],
  "Doctor Practice": [
    "Set up recurring consumables for a group practice.",
    "Compare diagnostic devices with leasing.",
  ],
  Hospitality: [
    "Find cleaning and hospitality robots for 12 hotels.",
    "Compare service robots with leasing.",
    "Create a maintenance package for hotel operations.",
  ],
  "Cleaning Company": [
    "Build a cleaning robot fleet for mixed commercial buildings.",
    "Compare spare parts and service SLAs.",
  ],
  "Facility Management": [
    "Find cleaning robots for mixed commercial buildings.",
    "Compare service coverage in Germany and Austria.",
    "Build a fleet plan with spare parts.",
  ],
  "Car Dealership": [
    "Find cleaning robots for showroom floors.",
    "Compare leasing options for autonomous cleaning robots.",
    "Create a service plan for multiple locations.",
  ],
  Agriculture: [
    "Field inspection robots with seasonal maintenance.",
    "Compare agricultural robotics suppliers.",
  ],
  "Security Company": [
    "Deploy patrol robots with spare parts pool.",
    "Compare security robot service networks.",
  ],
  Retail: [
    "In-store cleaning automation with financing.",
    "Compare retail-ready cleaning robots.",
  ],
  Logistics: [
    "Warehouse robots with integration support.",
    "Compare fulfillment-compatible automation.",
  ],
  "Industrial Site": [
    "Inspection robots for production and logistics zones.",
    "Compare industrial service coverage.",
  ],
  "Education / Campus": [
    "Campus-wide indoor and outdoor maintenance plan.",
    "Compare robots for education facilities.",
  ],
  "Real Estate / Property Management": [
    "Property portfolio cleaning automation.",
    "Compare multi-site service contracts.",
  ],
};

export function getRfqTemplatesForIndustry(industry: Industry): IndustryRfqTemplate[] {
  return industryRfqTemplates.filter(
    (t) => t.industry === industry || t.vertical === "both"
  );
}

export function getAiPromptsForIndustry(industry: Industry): string[] {
  return industryAiPrompts[industry] ?? industryAiPrompts["Facility Management"];
}

/** Cross-industry product recommendation pairs for dashboards */
export const crossIndustryRecommendations = [
  { industry: "Hospital / Clinic" as Industry, productCategory: "Garden Robots", reason: "Campus outdoor area maintenance" },
  { industry: "Hospital / Clinic" as Industry, productCategory: "Cleaning Robots", reason: "Large facility floor cleaning" },
  { industry: "Hospitality" as Industry, productCategory: "Hygiene", reason: "Consumables alongside automation" },
  { industry: "Municipality" as Industry, productCategory: "PPE", reason: "Public facility hygiene supply" },
  { industry: "Facility Management" as Industry, productCategory: "PPE", reason: "Client site hygiene requirements" },
  { industry: "Car Dealership" as Industry, productCategory: "Hygiene", reason: "Showroom hygiene consumables" },
  { industry: "Education / Campus" as Industry, productCategory: "Cleaning Robots", reason: "Hall and corridor automation" },
  { industry: "Industrial Site" as Industry, productCategory: "PPE", reason: "Workplace safety supply" },
  { industry: "Retail" as Industry, productCategory: "Security Robots", reason: "After-hours patrol automation" },
  { industry: "Logistics" as Industry, productCategory: "Inspection Robots", reason: "Warehouse aisle inspection" },
  { industry: "Care Home / Care Group" as Industry, productCategory: "Cleaning Robots", reason: "Common area cleaning automation" },
  { industry: "Laboratory" as Industry, productCategory: "Sterilization", reason: "Lab sterilization equipment" },
  { industry: "Public Sector" as Industry, productCategory: "Emergency Supply", reason: "Reserve stock compliance" },
  { industry: "Doctor Practice" as Industry, productCategory: "Diagnostics", reason: "Point-of-care diagnostics" },
  { industry: "Agriculture" as Industry, productCategory: "Inspection Robots", reason: "Field perimeter monitoring" },
  { industry: "Security Company" as Industry, productCategory: "Spare Parts", reason: "Fleet maintenance inventory" },
  { industry: "Distributor / Wholesaler" as Industry, productCategory: "Warehouse Robots", reason: "Distribution center automation" },
  { industry: "Real Estate / Property Management" as Industry, productCategory: "Garden Robots", reason: "Landscape maintenance" },
  { industry: "Cleaning Company" as Industry, productCategory: "Service Packages", reason: "Unified client SLA bundles" },
  { industry: "Hospital / Clinic" as Industry, productCategory: "Hospitality Robots", reason: "Visitor guidance in large hospitals" },
];

export const industryProductRecommendations = INDUSTRIES.flatMap((industry, i) =>
  [0, 1].map((j) => ({
    id: `rec-${i}-${j}`,
    industry,
    category: templateSeeds[(i + j) % templateSeeds.length]?.categories[0] ?? "Consumables",
    priority: j === 0 ? "primary" : "secondary",
  }))
).slice(0, 30);
