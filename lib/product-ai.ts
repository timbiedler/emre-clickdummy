import type { Product, Vertical } from "@/data/types";
import { getProducts } from "@/data";

const medicalBuyers: Record<string, string[]> = {
  Diagnostics: ["Hospitals", "Laboratories", "Test Centers"],
  PPE: ["Care Homes", "Hospitals", "Public Sector"],
  Consumables: ["Hospitals", "Care Homes", "Doctor Practices"],
  Laboratory: ["Laboratories", "Hospitals", "Public Sector"],
  "Medical Devices": ["Hospitals", "Care Groups", "Public Sector"],
  Hygiene: ["Care Homes", "Hospitals", "NGOs"],
  "Emergency Supply": ["Public Sector", "NGOs", "Hospitals"],
  "Care Equipment": ["Care Homes", "Hospitals", "Distributors"],
  Monitoring: ["Hospitals", "Doctor Practices", "Care Homes"],
  Respiratory: ["Hospitals", "Care Homes", "Public Sector"],
  "Wound Care": ["Care Homes", "Hospitals", "Doctor Practices"],
  Sterilization: ["Hospitals", "Doctor Practices", "Laboratories"],
};

const roboticsBuyers: Record<string, string[]> = {
  "Cleaning Robots": ["Hotels", "Cleaning Companies", "Facility Management"],
  "Security Robots": ["Industrial Sites", "Security Companies", "Municipalities"],
  "Hospitality Robots": ["Hotels", "Hospitality Groups", "Retail"],
  "Garden Robots": ["Municipalities", "Facility Management", "Agriculture"],
  "Agricultural Robots": ["Agriculture", "Cooperatives", "Municipalities"],
  "Warehouse Robots": ["Logistics", "Retail", "Industrial Sites"],
  "Inspection Robots": ["Industrial Sites", "Agriculture", "Municipalities"],
  "Spare Parts": ["Cleaning Companies", "Dealers", "Facility Management"],
  Batteries: ["Dealers", "Cleaning Companies", "Industrial Sites"],
  Sensors: ["Dealers", "Security Companies", "Integrators"],
  Brushes: ["Cleaning Companies", "Dealers", "Facility Management"],
  "Service Packages": ["Hotels", "Cleaning Companies", "Car Dealerships"],
};

export interface ProductAiAdvisor {
  recommendedBuyerTypes: string[];
  recommendedSalesChannels: string[];
  roiEstimate: string;
  budgetFit: string;
  alternativeIds: string[];
  crossSellIds: string[];
  leasingRecommendation: string;
  serviceRecommendation: string;
}

export function getProductAiAdvisor(product: Product): ProductAiAdvisor {
  const buyerMap = product.vertical === "medical" ? medicalBuyers : roboticsBuyers;
  const recommendedBuyerTypes =
    buyerMap[product.category] ?? product.salesChannels.slice(0, 3);

  const roiEstimate =
    product.vertical === "robotics"
      ? product.price > 20000
        ? "18–24 month ROI via labour cost reduction"
        : "Operational savings within 12–18 months"
      : product.price > 5000
        ? "Procurement cost reduction 8–15% vs. spot buying"
        : "Volume pricing saves 12–22% on recurring orders";

  const budgetFit =
    product.price > 50000
      ? "Enterprise budget — leasing recommended"
      : product.price > 5000
        ? "Mid-market fit — lease or finetrading"
        : "Operational spend — subscription or bulk buy";

  const leasingRecommendation =
    product.price > 10000
      ? `Lease ${product.price > 50000 ? 60 : 48} months — preserves CAPEX for core operations`
      : product.price > 500
        ? "36-month lease keeps monthly costs predictable"
        : "Low-ticket item — subscription or volume contract preferred";

  const serviceRecommendation = product.serviceCoverage
    ? product.vertical === "robotics"
      ? "Fleet service contract recommended for multi-unit deployment"
      : "Compliance & delivery SLA package available via EU service network"
    : "Add service coverage for installation and warranty support";

  return {
    recommendedBuyerTypes,
    recommendedSalesChannels: product.salesChannels,
    roiEstimate,
    budgetFit,
    alternativeIds: product.relatedIds,
    crossSellIds: product.relatedIds.slice(0, 1),
    leasingRecommendation,
    serviceRecommendation,
  };
}

export const medicalConsultationUseCases = [
  "I manage procurement for a care group",
  "I need emergency medical supply",
  "I want to compare diagnostic suppliers",
  "I need MDR-ready medical devices",
  "I need consumables with recurring delivery",
];

export const roboticsConsultationUseCases = [
  "I operate a hotel group",
  "I run a cleaning company",
  "I manage a car dealership",
  "I need security robots",
  "I need spare parts and maintenance",
];

export function getConsultationUseCases(vertical: Vertical) {
  return vertical === "medical" ? medicalConsultationUseCases : roboticsConsultationUseCases;
}

export function resolveProductShortlist(vertical: Vertical, count = 3) {
  return getProducts(vertical).slice(0, count);
}
