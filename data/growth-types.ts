import type { Country } from "./types";
import type { EuRegionKey } from "./eu-regions";

export type GrowthVertical = "medical" | "robotics";

export type LeadIndustryType =
  | "hospital"
  | "clinic"
  | "care_home"
  | "lab"
  | "practice"
  | "public_sector"
  | "ngo"
  | "distributor"
  | "hotel"
  | "cleaning"
  | "facility_management"
  | "car_dealer"
  | "municipality"
  | "agriculture"
  | "security"
  | "logistics"
  | "industrial";

export type LeadStatus = "new" | "qualified" | "nurturing" | "assigned" | "converted" | "disqualified";

export type SignalType =
  | "new_facility"
  | "expansion"
  | "tender"
  | "procurement"
  | "hiring"
  | "website_tech"
  | "service_need"
  | "cleaning_demand"
  | "security_demand"
  | "medical_demand"
  | "financing"
  | "competitor"
  | "category_trend";

export type CampaignType =
  | "email"
  | "google_ads"
  | "landingpage"
  | "sales_partner"
  | "showroom"
  | "qr_nfc"
  | "deal"
  | "leasing"
  | "bundle"
  | "product_launch";

export type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed";

export type LandingpageType =
  | "product"
  | "bundle"
  | "deal"
  | "leasing"
  | "industry"
  | "territory"
  | "showroom"
  | "service";

export type OutreachChannel =
  | "email"
  | "google_ads"
  | "landingpage"
  | "sales_partner"
  | "qr_nfc"
  | "showroom"
  | "api_webhook";

export type ConsentStatus = "opted_in" | "legitimate_interest" | "pending" | "opted_out";

export interface GrowthTerritory {
  id: string;
  country: Country;
  region: EuRegionKey;
  cities: string[];
  industryDensity: number;
  customerPotential: number;
  buyerCount: number;
  salesPartnerCount: number;
  serviceCoverage: number;
  financeCoverage: number;
  pipelineValue: number;
  whiteSpots: number;
  expansionScore: number;
  potentialCustomers: number;
  leads: number;
  assignedPartner: string;
  openRfqs: number;
  offers: number;
  leasingPotential: number;
  recommendedAction: string;
}

export interface GrowthLead {
  id: string;
  company: string;
  industry: LeadIndustryType;
  vertical: GrowthVertical;
  country: Country;
  city: string;
  size: "smb" | "mid" | "enterprise";
  fitScore: number;
  productFit: string[];
  financePotential: "low" | "medium" | "high";
  serviceCoverage: number;
  source: string;
  signal: string;
  status: LeadStatus;
  owner: string;
  suggestedCampaign: string;
}

export interface GrowthSignal {
  id: string;
  title: string;
  type: SignalType;
  company: string;
  country: Country;
  vertical: GrowthVertical;
  confidence: number;
  detectedAt: string;
  products: string[];
  outreachAngle: string;
  suggestedOffer: string;
  partner: string;
  aiRecommendation: string;
}

export interface GrowthCampaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  vertical: GrowthVertical;
  territories: Country[];
  startDate: string;
  endDate: string;
  budget: number;
  leadsTarget: number;
  channelMix: string[];
  owner: string;
  landingpageId?: string;
  bundleId?: string;
}

export interface GrowthBundle {
  id: string;
  name: string;
  vertical: GrowthVertical;
  products: string[];
  includesService: boolean;
  includesWarranty: boolean;
  includesInsurance: boolean;
  includesLeasing: boolean;
  includesFinancing: boolean;
  includesTraining: boolean;
  listPrice: number;
  leasingRateMonthly: number;
  marginPercent: number;
  recommendedIndustries: string[];
  recommendedTerritories: Country[];
}

export interface GrowthLandingpage {
  id: string;
  title: string;
  type: LandingpageType;
  vertical: GrowthVertical;
  territory?: Country;
  readiness: {
    copy: number;
    seo: number;
    assets: number;
    compliance: number;
  };
  aiHeadline: string;
  aiSubcopy: string;
  status: "draft" | "review" | "ready" | "published";
}

export interface GrowthEmailSequence {
  id: string;
  name: string;
  steps: number;
  openRate: number;
  replyRate: number;
  consent: ConsentStatus;
  territory: Country;
  vertical: GrowthVertical;
  status: "draft" | "active" | "paused";
}

export interface GrowthGoogleAdDraft {
  id: string;
  campaignName: string;
  headline: string;
  description: string;
  budgetDaily: number;
  territory: Country;
  consent: ConsentStatus;
  status: "draft" | "review" | "ready";
}

export interface GrowthPartnerTask {
  id: string;
  partner: string;
  leadId?: string;
  task: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "done";
  territory: Country;
}

export interface GrowthBudgetPlan {
  id: string;
  name: string;
  period: string;
  totalBudget: number;
  emailPct: number;
  adsPct: number;
  partnerPct: number;
  landingPct: number;
  funnelLeads: number;
  funnelMql: number;
  funnelSql: number;
  funnelWon: number;
  territoryPotential: number;
  roiEstimate: number;
}

export interface GrowthRoutingRow {
  id: string;
  leadId: string;
  company: string;
  country: Country;
  partner: string;
  status: LeadStatus;
  lastAction: string;
  openRfqs: number;
}

export interface GrowthPerformanceKpis {
  leadsDiscovered: number;
  signalsProcessed: number;
  campaignsActive: number;
  outreachSent: number;
  mqlConversion: number;
  sqlConversion: number;
  rfqsCreated: number;
  offersPrepared: number;
  leasingPipeline: number;
  partnerTasksOpen: number;
  budgetUtilization: number;
  roiYtd: number;
  whiteSpotsClosed: number;
  territoryCoverage: number;
}
