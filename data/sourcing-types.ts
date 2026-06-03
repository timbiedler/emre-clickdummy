import type { Country, Industry, Vertical } from "./types";

export type DemandGapSource =
  | "marketplace_search"
  | "ai_assistant"
  | "rfq"
  | "campaign"
  | "lead_discovery"
  | "signal_detection"
  | "network_map"
  | "service_ticket"
  | "group_buy"
  | "finance_request"
  | "alert_watchlist"
  | "magazine_interest"
  | "order_exception";

export type SourcingVertical = Vertical | "combined";

export type SourcingPriority = "critical" | "high" | "medium" | "low";

export type ProductGapRequestStatus =
  | "new"
  | "under_review"
  | "supplier_search"
  | "supplier_contacted"
  | "data_requested"
  | "commercial_review"
  | "product_enrichment"
  | "asset_readiness"
  | "marketplace_readiness"
  | "returned_marketplace"
  | "returned_campaign"
  | "buyers_notified"
  | "archived";

export type SupplierSourcingStatus =
  | "identified"
  | "contact_planned"
  | "contacted"
  | "interested"
  | "data_requested"
  | "in_onboarding"
  | "commercial_review"
  | "approved"
  | "rejected";

export type CoverageStatus = "none" | "partial" | "adequate";

export interface DemandGap {
  id: string;
  title: string;
  requestedProduct: string;
  category: string;
  vertical: SourcingVertical;
  industry: Industry;
  country: Country;
  region: string;
  source: DemandGapSource;
  interestedBuyers: number;
  estimatedVolume: string;
  estimatedBudget: number;
  leasingRelevant: boolean;
  serviceRelevant: boolean;
  urgency: SourcingPriority;
  requiredCertifications: string[];
  supplierCoverage: CoverageStatus;
  productCoverage: CoverageStatus;
  priority: SourcingPriority;
  aiRecommendation: string;
  status: "open" | "linked" | "archived";
  linkedRequestId?: string;
  linkedRfqIds: string[];
  linkedCampaignIds: string[];
  assignedOwner?: string;
  createdAt: string;
}

export interface ProductGapRequest {
  id: string;
  requestedProduct: string;
  category: string;
  vertical: SourcingVertical;
  industry: Industry;
  country: Country;
  region: string;
  source: DemandGapSource;
  linkedRfqIds: string[];
  linkedCampaignIds: string[];
  linkedGroupBuyIds: string[];
  linkedLeadIds: string[];
  interestedBuyerIds: string[];
  estimatedVolume: string;
  expectedBudget: number;
  targetPrice?: number;
  targetLeasingRate?: number;
  urgency: SourcingPriority;
  requiredCertifications: string[];
  requiredServiceCoverage: boolean;
  requiredWarranty: boolean;
  requiredFinanceOption: boolean;
  preferredSupplierCountry?: Country;
  minimumDeliveryDays: number;
  notes: string;
  aiSourcingRecommendation: string;
  status: ProductGapRequestStatus;
  assignedOwner?: string;
  linkedDemandGapId?: string;
  linkedSupplierIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SourcingSupplierCandidate {
  id: string;
  name: string;
  country: Country;
  categories: string[];
  productMatchScore: number;
  complianceReadiness: number;
  documentReadiness: number;
  pricingReadiness: number;
  stockReadiness: number;
  translationReadiness: number;
  serviceCoverage: boolean;
  financeCompatible: boolean;
  onboardingStatus: SupplierSourcingStatus;
  contactStatus: string;
  lastContact?: string;
  assignedOwner?: string;
  linkedRequestIds: string[];
  vertical: Vertical;
}

export interface CatalogExpansionItem {
  id: string;
  productName: string;
  category: string;
  supplierName: string;
  vertical: Vertical;
  industries: Industry[];
  country: Country;
  status: ProductGapRequestStatus;
  missingFields: string[];
  catalogReadinessScore: number;
  marketplaceReadinessScore: number;
  linkedRequestId?: string;
}

export interface ProductEnrichmentItem {
  id: string;
  productName: string;
  supplierName: string;
  vertical: Vertical;
  textReadiness: number;
  specsReadiness: number;
  imageReadiness: number;
  videoReadiness: number;
  certificatesReadiness: number;
  translationsReadiness: number;
  salesChannelReadiness: number;
  leasingReadiness: number;
  serviceReadiness: number;
  insuranceReadiness: number;
  seoReadiness: number;
  marketplaceReadiness: number;
  linkedRequestId?: string;
  status: ProductGapRequestStatus;
}

export interface ReturnedProduct {
  id: string;
  productName: string;
  category: string;
  supplierName: string;
  vertical: Vertical;
  sourceDemandGapId?: string;
  linkedBuyerIds: string[];
  linkedRfqIds: string[];
  linkedCampaignIds: string[];
  marketplaceReadiness: number;
  leasingReadiness: number;
  serviceReadiness: number;
  launched: boolean;
}

export interface InterestedBuyer {
  id: string;
  companyName: string;
  industry: Industry;
  country: Country;
  requestedProduct: string;
  category: string;
  estimatedVolume: string;
  budget: number;
  financeInterest: boolean;
  leasingInterest: boolean;
  serviceNeed: boolean;
  originalSource: DemandGapSource;
  alertStatus: "active" | "none";
  rfqStatus: string;
  notificationStatus: "pending" | "sent" | "none";
  linkedRequestId?: string;
}

export interface SourcingOwner {
  id: string;
  name: string;
  email: string;
  activeTasks: number;
  region: string;
}

export interface SourcingTask {
  id: string;
  title: string;
  ownerId: string;
  requestId?: string;
  dueDate: string;
  status: "open" | "in_progress" | "done";
}

export interface FailedMarketplaceSearch {
  id: string;
  query: string;
  industry: Industry;
  country: Country;
  role: string;
  timestamp: string;
  interestedBuyer?: string;
}

export interface CreateGapRequestInput {
  requestedProduct: string;
  category?: string;
  vertical?: SourcingVertical;
  industry?: Industry;
  country?: Country;
  region?: string;
  source: DemandGapSource;
  expectedBudget?: number;
  estimatedVolume?: string;
  urgency?: SourcingPriority;
  notes?: string;
  linkedRfqIds?: string[];
  linkedDemandGapId?: string;
  aiPrompt?: string;
}

export const PIPELINE_COLUMNS: { id: ProductGapRequestStatus; labelKey: string }[] = [
  { id: "new", labelKey: "sourcing.statusNew" },
  { id: "under_review", labelKey: "sourcing.statusUnderReview" },
  { id: "supplier_search", labelKey: "sourcing.statusSupplierSearch" },
  { id: "supplier_contacted", labelKey: "sourcing.statusSupplierContacted" },
  { id: "data_requested", labelKey: "sourcing.statusDataRequested" },
  { id: "commercial_review", labelKey: "sourcing.statusCommercialReview" },
  { id: "product_enrichment", labelKey: "sourcing.statusEnrichment" },
  { id: "marketplace_readiness", labelKey: "sourcing.statusMarketplaceReady" },
  { id: "returned_marketplace", labelKey: "sourcing.statusReturned" },
];
