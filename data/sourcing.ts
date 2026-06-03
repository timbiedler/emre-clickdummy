import { COUNTRIES } from "./constants";
import { INDUSTRIES } from "./industries";
import { pick } from "./generators";
import type { Country, Vertical } from "./types";
import type {
  CatalogExpansionItem,
  DemandGap,
  DemandGapSource,
  FailedMarketplaceSearch,
  InterestedBuyer,
  ProductEnrichmentItem,
  ProductGapRequest,
  ReturnedProduct,
  SourcingOwner,
  SourcingPriority,
  SourcingSupplierCandidate,
  SourcingTask,
  SourcingVertical,
} from "./sourcing-types";

const medicalProducts = [
  "Portable patient monitors",
  "Oxygen concentrators",
  "Nitrile gloves",
  "Care beds",
  "Lab consumables",
  "Wound care kits",
  "Sterilization devices",
  "PPE bundles",
  "Emergency supply kits",
  "Rapid diagnostic tests",
];

const roboticsProducts = [
  "Cleaning robots",
  "Security patrol robots",
  "Hospitality robots",
  "Outdoor maintenance robots",
  "Agricultural inspection robots",
  "Warehouse AMRs",
  "Battery packs",
  "Brush modules",
  "Spare parts kits",
  "Maintenance packages",
];

const gapTitles = [
  "Portable patient monitors requested by hospitals in France",
  "Cleaning robots searched by hospitality groups in Denmark",
  "Security patrol robots requested by industrial sites in Poland",
  "Nitrile glove RFQs exceed available supplier coverage in Baltics",
  "Spare parts gap for cleaning robots in Finland",
  "Care beds requested with leasing option in Austria",
  "Outdoor maintenance robots requested by clinic campuses in Germany",
  "No suitable robotics service partner coverage in Norway",
  "Group buy demand for oxygen concentrators in Romania",
  "High finance demand for hotel service robots in Spain",
  "Sterilization devices needed for surgical centers in Italy",
  "Warehouse robots requested by logistics hubs in Netherlands",
  "Diagnostic test kits shortage signal in Czech Republic",
  "Sensor modules for security fleet upgrade in Sweden",
  "Emergency PPE framework gap in public sector Belgium",
];

const sources: DemandGapSource[] = [
  "marketplace_search",
  "ai_assistant",
  "rfq",
  "campaign",
  "lead_discovery",
  "signal_detection",
  "network_map",
  "service_ticket",
  "group_buy",
  "finance_request",
  "alert_watchlist",
];

const priorities: SourcingPriority[] = ["critical", "high", "medium", "low"];
const statuses = [
  "new",
  "under_review",
  "supplier_search",
  "supplier_contacted",
  "data_requested",
  "commercial_review",
  "product_enrichment",
  "asset_readiness",
  "marketplace_readiness",
  "returned_marketplace",
] as const;

const owners = [
  { id: "own-1", name: "Sofia Richter", email: "s.richter@distribution.engine", region: "DACH" },
  { id: "own-2", name: "Marc Dubois", email: "m.dubois@distribution.engine", region: "Western EU" },
  { id: "own-3", name: "Elena Kowalski", email: "e.kowalski@distribution.engine", region: "Central EU" },
  { id: "own-4", name: "Anna Lind", email: "a.lind@distribution.engine", region: "Nordics" },
  { id: "own-5", name: "Tomas Berg", email: "t.berg@distribution.engine", region: "Baltics" },
];

export const sourcingOwners: SourcingOwner[] = owners.map((o, i) => ({
  ...o,
  activeTasks: 3 + (i % 5),
}));

function regionFor(country: Country): string {
  const map: Partial<Record<Country, string>> = {
    Germany: "DACH",
    Austria: "DACH",
    Switzerland: "DACH",
    France: "Western EU",
    Spain: "Western EU",
    Italy: "Western EU",
    Netherlands: "Benelux",
    Belgium: "Benelux",
    Poland: "Central EU",
    Norway: "Nordics",
    Finland: "Nordics",
    Sweden: "Nordics",
    Denmark: "Nordics",
    Estonia: "Baltics",
    Latvia: "Baltics",
    Lithuania: "Baltics",
  };
  return map[country] ?? "EU";
}

export const demandGaps: DemandGap[] = Array.from({ length: 50 }, (_, i) => {
  const vertical: SourcingVertical = i % 5 === 0 ? "combined" : i % 2 === 0 ? "medical" : "robotics";
  const product =
    vertical === "medical"
      ? pick(medicalProducts, i)
      : vertical === "robotics"
        ? pick(roboticsProducts, i)
        : pick([...medicalProducts, ...roboticsProducts], i);
  const country = pick(COUNTRIES, i);
  return {
    id: `dg-${String(i + 1).padStart(3, "0")}`,
    title: gapTitles[i % gapTitles.length] ?? `${product} demand in ${country}`,
    requestedProduct: product,
    category: product.split(" ").slice(-1)[0] + " / Equipment",
    vertical,
    industry: pick(INDUSTRIES, i),
    country,
    region: regionFor(country),
    source: pick(sources, i),
    interestedBuyers: 2 + (i % 18),
    estimatedVolume: `${50 + (i % 20) * 10} units / year`,
    estimatedBudget: 15000 + i * 4200,
    leasingRelevant: i % 3 !== 0,
    serviceRelevant: i % 2 === 0,
    urgency: pick(priorities, i),
    requiredCertifications: i % 2 === 0 ? ["CE", "MDR"] : ["CE", "ISO 13485"],
    supplierCoverage: i % 4 === 0 ? "none" : i % 3 === 0 ? "partial" : "adequate",
    productCoverage: i % 5 === 0 ? "none" : i % 2 === 0 ? "partial" : "adequate",
    priority: pick(priorities, i + 1),
    aiRecommendation:
      i % 3 === 0
        ? "Prioritize supplier outreach in region; high RFQ overlap detected."
        : "Bundle with existing catalog line; moderate enrichment effort.",
    status: i % 7 === 0 ? "linked" : i % 11 === 0 ? "archived" : "open",
    linkedRequestId: i % 7 === 0 ? `pgr-${String((i % 40) + 1).padStart(3, "0")}` : undefined,
    linkedRfqIds: i % 4 === 0 ? [`RFQ-${String(100 + i).padStart(3, "0")}`] : [],
    linkedCampaignIds: i % 5 === 0 ? [`cmp-${i}`] : [],
    assignedOwner: i % 3 === 0 ? pick(owners, i).id : undefined,
    createdAt: `2026-0${1 + (i % 5)}-${10 + (i % 18)}`,
  };
});

export const productGapRequests: ProductGapRequest[] = Array.from({ length: 40 }, (_, i) => {
  const vertical: SourcingVertical = i % 4 === 0 ? "combined" : i % 2 === 0 ? "medical" : "robotics";
  const product =
    vertical === "medical" ? pick(medicalProducts, i + 2) : pick(roboticsProducts, i + 1);
  const country = pick(COUNTRIES, i + 3);
  return {
    id: `pgr-${String(i + 1).padStart(3, "0")}`,
    requestedProduct: product,
    category: product.includes("robot") ? "Robotics" : "Medical Devices",
    vertical,
    industry: pick(INDUSTRIES, i),
    country,
    region: regionFor(country),
    source: pick(sources, i + 1),
    linkedRfqIds: [`RFQ-${String(200 + i).padStart(3, "0")}`],
    linkedCampaignIds: i % 2 === 0 ? [`cmp-${i + 10}`] : [],
    linkedGroupBuyIds: i % 4 === 0 ? [`gb-${i}`] : [],
    linkedLeadIds: i % 3 === 0 ? [`lead-${i}`] : [],
    interestedBuyerIds: Array.from({ length: 1 + (i % 4) }, (_, j) => `ib-${i * 2 + j + 1}`),
    estimatedVolume: `${100 + i * 15} units`,
    expectedBudget: 28000 + i * 5100,
    targetPrice: 1200 + i * 45,
    targetLeasingRate: 89 + (i % 12) * 8,
    urgency: pick(priorities, i),
    requiredCertifications: ["CE", "MDR"],
    requiredServiceCoverage: i % 2 === 0,
    requiredWarranty: true,
    requiredFinanceOption: i % 3 !== 0,
    preferredSupplierCountry: pick(COUNTRIES, i + 5),
    minimumDeliveryDays: 14 + (i % 21),
    notes: "Structured sourcing request from Product Supply Layer.",
    aiSourcingRecommendation:
      "Contact 3 regional manufacturers; request tier pricing and leasing sheets.",
    status: pick([...statuses], i) as ProductGapRequest["status"],
    assignedOwner: pick(owners, i).id,
    linkedDemandGapId: i < 30 ? `dg-${String(i + 1).padStart(3, "0")}` : undefined,
    linkedSupplierIds: [`ssc-${(i % 30) + 1}`, `ssc-${(i % 30) + 2}`],
    createdAt: "2026-02-01",
    updatedAt: "2026-03-15",
  };
});

const supplierNames = [
  "NordMed Manufacturing",
  "Alpine Diagnostics GmbH",
  "EuroRobotics Supply",
  "Baltic MedImport",
  "CleanBot Industries",
  "ServoParts EU",
  "MediWholesale Benelux",
  "RoboTech DACH",
  "CareSupply Partners",
  "FieldBot Manufacturing",
];

export const sourcingSuppliers: SourcingSupplierCandidate[] = Array.from({ length: 40 }, (_, i) => ({
  id: `ssc-${i + 1}`,
  name: pick(supplierNames, i),
  country: pick(COUNTRIES, i),
  categories: i % 2 === 0 ? ["Medical Devices", "PPE"] : ["Robotics", "Spare Parts"],
  productMatchScore: 55 + (i % 45),
  complianceReadiness: 60 + (i % 40),
  documentReadiness: 50 + (i % 50),
  pricingReadiness: 65 + (i % 35),
  stockReadiness: 70 + (i % 30),
  translationReadiness: 55 + (i % 45),
  serviceCoverage: i % 3 !== 0,
  financeCompatible: i % 2 === 0,
  onboardingStatus: pick(
    [
      "identified",
      "contact_planned",
      "contacted",
      "interested",
      "data_requested",
      "in_onboarding",
      "commercial_review",
      "approved",
    ] as const,
    i
  ),
  contactStatus: i % 4 === 0 ? "Awaiting response" : "In dialogue",
  lastContact: `2026-03-${10 + (i % 18)}`,
  assignedOwner: pick(owners, i).id,
  linkedRequestIds: [`pgr-${String((i % 40) + 1).padStart(3, "0")}`],
  vertical: (i % 2 === 0 ? "medical" : "robotics") as Vertical,
}));

export const catalogExpansionItems: CatalogExpansionItem[] = Array.from({ length: 40 }, (_, i) => ({
  id: `cat-${i + 1}`,
  productName: i % 2 === 0 ? pick(medicalProducts, i) : pick(roboticsProducts, i),
  category: i % 2 === 0 ? "Medical" : "Robotics",
  supplierName: pick(supplierNames, i),
  vertical: (i % 2 === 0 ? "medical" : "robotics") as Vertical,
  industries: [pick(INDUSTRIES, i), pick(INDUSTRIES, i + 1)],
  country: pick(COUNTRIES, i),
  status: pick([...statuses], i + 2) as CatalogExpansionItem["status"],
  missingFields: pick(
    [
      ["images", "videos"],
      ["price tiers", "leasing rate"],
      ["certificates", "warranty"],
      ["service coverage"],
      ["translations"],
    ],
    i
  ).flat(),
  catalogReadinessScore: 40 + (i % 55),
  marketplaceReadinessScore: 35 + (i % 60),
  linkedRequestId: `pgr-${String((i % 40) + 1).padStart(3, "0")}`,
}));

export const productEnrichmentItems: ProductEnrichmentItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `enr-${i + 1}`,
  productName: pick([...medicalProducts, ...roboticsProducts], i),
  supplierName: pick(supplierNames, i),
  vertical: (i % 2 === 0 ? "medical" : "robotics") as Vertical,
  textReadiness: 50 + (i % 50),
  specsReadiness: 55 + (i % 45),
  imageReadiness: 40 + (i % 60),
  videoReadiness: 30 + (i % 70),
  certificatesReadiness: 60 + (i % 40),
  translationsReadiness: 45 + (i % 55),
  salesChannelReadiness: 50 + (i % 50),
  leasingReadiness: 55 + (i % 45),
  serviceReadiness: 60 + (i % 40),
  insuranceReadiness: 50 + (i % 50),
  seoReadiness: 40 + (i % 60),
  marketplaceReadiness: 45 + (i % 55),
  linkedRequestId: `pgr-${String((i % 40) + 1).padStart(3, "0")}`,
  status: pick([...statuses], i + 3) as ProductEnrichmentItem["status"],
}));

export const returnedProducts: ReturnedProduct[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ret-${i + 1}`,
  productName: pick([...medicalProducts, ...roboticsProducts], i + 5),
  category: i % 2 === 0 ? "Medical Devices" : "Robotics",
  supplierName: pick(supplierNames, i),
  vertical: (i % 2 === 0 ? "medical" : "robotics") as Vertical,
  sourceDemandGapId: `dg-${String((i % 50) + 1).padStart(3, "0")}`,
  linkedBuyerIds: [`ib-${i + 1}`, `ib-${i + 26}`],
  linkedRfqIds: [`RFQ-${300 + i}`],
  linkedCampaignIds: i % 2 === 0 ? [`cmp-ret-${i}`] : [],
  marketplaceReadiness: 75 + (i % 25),
  leasingReadiness: 70 + (i % 30),
  serviceReadiness: 65 + (i % 35),
  launched: i % 4 === 0,
}));

export const interestedBuyers: InterestedBuyer[] = Array.from({ length: 50 }, (_, i) => ({
  id: `ib-${i + 1}`,
  companyName: `Buyer ${pick(["Care", "Hotel", "Clinic", "Municipal", "Industrial"], i)} Group ${i + 1}`,
  industry: pick(INDUSTRIES, i),
  country: pick(COUNTRIES, i),
  requestedProduct: pick([...medicalProducts, ...roboticsProducts], i),
  category: "Equipment",
  estimatedVolume: `${20 + (i % 15) * 5} units`,
  budget: 12000 + i * 2800,
  financeInterest: i % 3 !== 0,
  leasingInterest: i % 2 === 0,
  serviceNeed: i % 4 !== 0,
  originalSource: pick(sources, i),
  alertStatus: i % 5 === 0 ? "active" : "none",
  rfqStatus: i % 3 === 0 ? "active" : "none",
  notificationStatus: i % 4 === 0 ? "sent" : i % 3 === 0 ? "pending" : "none",
  linkedRequestId: i % 2 === 0 ? `pgr-${String((i % 40) + 1).padStart(3, "0")}` : undefined,
}));

export const sourcingTasks: SourcingTask[] = Array.from({ length: 20 }, (_, i) => ({
  id: `task-${i + 1}`,
  title: pick(
    [
      "Contact supplier for tier pricing",
      "Request CE certificates",
      "Schedule product data enrichment",
      "Review commercial terms",
      "Prepare marketplace listing",
    ],
    i
  ),
  ownerId: pick(owners, i).id,
  requestId: `pgr-${String((i % 40) + 1).padStart(3, "0")}`,
  dueDate: `2026-04-${5 + (i % 20)}`,
  status: pick(["open", "in_progress", "done"] as const, i),
}));

export const sourcingLinkedCampaigns = Array.from({ length: 20 }, (_, i) => ({
  id: `cmp-src-${i + 1}`,
  name: `Campaign gap ${i + 1}`,
  country: pick(COUNTRIES, i),
  product: pick([...medicalProducts, ...roboticsProducts], i),
  requestId: `pgr-${String((i % 40) + 1).padStart(3, "0")}`,
}));

export const sourcingLinkedRfqs = Array.from({ length: 20 }, (_, i) => ({
  id: `RFQ-SRC-${100 + i}`,
  title: `Sourcing-linked RFQ ${i + 1}`,
  requestId: `pgr-${String((i % 40) + 1).padStart(3, "0")}`,
  matchedSuppliers: 1 + (i % 2),
}));

export function getSourcingKpis(requests: ProductGapRequest[]) {
  return {
    openDemandGaps: demandGaps.filter((d) => d.status === "open").length,
    productGapRequests: requests.length,
    highPriorityGaps: demandGaps.filter((d) => d.priority === "critical" || d.priority === "high").length,
    supplierSearchesActive: requests.filter((r) => r.status === "supplier_search").length,
    suppliersContacted: sourcingSuppliers.filter((s) =>
      ["contacted", "interested", "data_requested"].includes(s.onboardingStatus)
    ).length,
    productsInEnrichment: productEnrichmentItems.filter((e) => e.status === "product_enrichment").length,
    marketplaceReady: requests.filter((r) => r.status === "marketplace_readiness").length,
    interestedBuyersWaiting: interestedBuyers.filter((b) => b.notificationStatus === "pending").length,
    returnedThisMonth: returnedProducts.filter((r) => !r.launched).length,
    pipelineValue: requests.reduce((s, r) => s + r.expectedBudget, 0),
    leasingDemand: requests.filter((r) => r.requiredFinanceOption).length * 42000,
  };
}

export const initialFailedSearches: FailedMarketplaceSearch[] = Array.from({ length: 12 }, (_, i) => ({
  id: `fs-${i + 1}`,
  query: pick([...medicalProducts, ...roboticsProducts], i),
  industry: pick(INDUSTRIES, i),
  country: pick(COUNTRIES, i),
  role: "customer",
  timestamp: `2026-03-${20 - i}T10:00:00Z`,
}));
