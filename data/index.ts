export { medicalProducts } from "./medical-products";
export { roboticsProducts } from "./robotics-products";
export { suppliers } from "./suppliers";
export { buyers } from "./buyers";
export { rfqs } from "./rfqs";
export { offers } from "./offers";
export { orders } from "./orders";
export { invoices } from "./invoices";
export { servicepoints } from "./servicepoints";
export { magazineItems } from "./magazine";
export { financeApplications } from "./finance";
export { dataRoomDocuments } from "./data-room";
export { deals } from "./deals";
export { adminMetrics, adminAlerts, adminActivities } from "./admin-metrics";
export { platformUsers, companies } from "./users";
export {
  salesPartners,
  salesPartnerApplications,
  commissionModels,
  salesTerritories,
} from "./sales-partners";
export {
  industryRfqTemplates,
  getRfqTemplatesForIndustry,
  getAiPromptsForIndustry,
  crossIndustryRecommendations,
} from "./industry-content";
export { INDUSTRIES } from "./industries";
export { getNavForRole, getHomeForRole } from "./roles";

import { medicalProducts } from "./medical-products";
import { roboticsProducts } from "./robotics-products";
import type { Vertical } from "./types";

export function getProducts(vertical: Vertical) {
  return vertical === "medical" ? medicalProducts : roboticsProducts;
}

export function getAllProducts() {
  return [...medicalProducts, ...roboticsProducts];
}
