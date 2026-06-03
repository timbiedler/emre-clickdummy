export type Vertical = "medical" | "robotics";

export type UserRole =
  | "admin"
  | "customer"
  | "supplier"
  | "dealer"
  | "sales_partner"
  | "service_partner"
  | "finance_partner"
  | "agency"
  | "logistics";

export type Industry =
  | "Hospital / Clinic"
  | "Care Home / Care Group"
  | "Laboratory"
  | "Public Sector"
  | "Municipality"
  | "Distributor / Wholesaler"
  | "Doctor Practice"
  | "Hospitality"
  | "Cleaning Company"
  | "Facility Management"
  | "Car Dealership"
  | "Agriculture"
  | "Security Company"
  | "Retail"
  | "Logistics"
  | "Industrial Site"
  | "Education / Campus"
  | "Real Estate / Property Management";

export type PermissionAction = "view" | "create" | "edit" | "approve" | "export" | "admin";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  industry: Industry;
  secondaryIndustries: Industry[];
  companyId: string;
  companyName: string;
  country: Country;
  region: string;
  status: "active" | "invited" | "suspended";
  lastLogin: string;
}

export interface Company {
  id: string;
  name: string;
  role: UserRole;
  primaryIndustry: Industry;
  secondaryIndustries: Industry[];
  country: Country;
  region: string;
  companySize: "1-50" | "51-200" | "201-1000" | "1000+";
  preferredCategories: string[];
  financeStatus: "pre_approved" | "under_review" | "documents_missing" | "not_started";
  serviceCoverageNeeds: string[];
  buyingBehavior: string;
  activeRfqs: number;
  openOrders: number;
}

export interface SalesPartner {
  id: string;
  name: string;
  type: string;
  countries: Country[];
  regions: string[];
  industries: Industry[];
  categories: string[];
  salesChannels: string[];
  showroomAvailable: boolean;
  serviceCapabilities: string[];
  financeReadiness: "ready" | "in_progress" | "not_started";
  contractStatus: "active" | "pending" | "draft";
  approvalStatus: "approved" | "review" | "rejected" | "pending";
  assignedLeads: number;
  pipelineValue: number;
  commissionModel: string;
  performanceScore: number;
}

export interface SalesPartnerApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  countries: Country[];
  industries: Industry[];
  categories: string[];
  salesChannels: string[];
  showroomAvailable: boolean;
  serviceCapabilities: string[];
  financeReadiness: string;
  documentStatus: "complete" | "partial" | "missing";
  contractStatus: "unsigned" | "sent" | "signed";
  approvalStatus: "pending" | "review" | "approved" | "rejected";
  submittedAt: string;
  step: number;
}

export interface IndustryRfqTemplate {
  id: string;
  industry: Industry;
  title: string;
  description: string;
  categories: string[];
  vertical: Vertical | "both";
}

export interface CommissionModel {
  id: string;
  name: string;
  type: string;
  rate: string;
  categories: string[];
  regions: string[];
}

export interface SalesTerritory {
  id: string;
  partnerId: string;
  partnerName: string;
  country: Country;
  region: string;
  industries: Industry[];
  categories: string[];
}

export type Language =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pl"
  | "nl"
  | "sv"
  | "fi"
  | "no"
  | "et"
  | "lv"
  | "lt"
  | "zh";

export type Country =
  | "Germany"
  | "Austria"
  | "Switzerland"
  | "Netherlands"
  | "Belgium"
  | "France"
  | "Spain"
  | "Italy"
  | "Poland"
  | "Czech Republic"
  | "Slovakia"
  | "Hungary"
  | "Romania"
  | "Bulgaria"
  | "Norway"
  | "Finland"
  | "Sweden"
  | "Denmark"
  | "Estonia"
  | "Latvia"
  | "Lithuania";

export type TranslationStatus = "verified" | "pending" | "auto" | "missing";

export interface LocalizedText {
  en: string;
  de: string;
  fr: string;
  es: string;
  it: string;
  pl: string;
  nl: string;
  zh: string;
  sv?: string;
  fi?: string;
  no?: string;
  et?: string;
  lv?: string;
  lt?: string;
}

export interface Product {
  id: string;
  vertical: Vertical;
  name: LocalizedText;
  description: LocalizedText;
  sku: string;
  brand: string;
  category: string;
  salesChannels: string[];
  price: number;
  priceTiers: { minQty: number; price: number }[];
  currency: "EUR";
  availability: "in_stock" | "limited" | "preorder" | "out_of_stock";
  stock: number;
  primaryCountry: Country;
  countries: Country[];
  certification: string[];
  financeAvailable: boolean;
  serviceCoverage: boolean;
  supplierId: string;
  supplierName: string;
  imageGradient: string;
  imageLabel: string;
  specs: Record<string, string>;
  aiSummary: LocalizedText;
  translationStatus: TranslationStatus;
  relatedIds: string[];
  documents: { name: string; status: "verified" | "pending" | "missing" }[];
  deliveryDays: number;
  warrantyMonths?: number;
}

export interface Supplier {
  id: string;
  name: string;
  vertical: Vertical;
  country: Country;
  rating: number;
  products: number;
  responseTime: string;
  complianceScore: number;
  onboardingStatus: "approved" | "review" | "pending";
  salesChannels: string[];
  translationStatus: TranslationStatus;
  description: LocalizedText;
}

export interface Buyer {
  id: string;
  name: string;
  vertical: Vertical;
  country: Country;
  type: string;
  activeRfqs: number;
  totalOrders: number;
  creditStatus: "approved" | "review" | "pending";
}

export type RfqCreatedFrom =
  | "product"
  | "assistant"
  | "lead"
  | "sourcing"
  | "group_buy"
  | "bundle"
  | "deal"
  | "checkout"
  | "generic";

export interface RfqStatusTimelineEntry {
  status: string;
  timestamp: string;
  note?: string;
}

export interface RfqSelectedSupplier {
  id: string;
  name: string;
  score: number;
  country: Country;
}

export interface RFQ {
  id: string;
  rfqNumber?: string;
  vertical: Vertical;
  title: LocalizedText;
  buyerId: string;
  status: "draft" | "active" | "matching" | "offers_received" | "closed";
  quantity: number;
  budget: number;
  deliveryCountry: Country;
  createdAt: string;
  deadline: string;
  matchedSuppliers: number;
  offersCount: number;
  translationStatus: TranslationStatus;
  message: LocalizedText;
  productId?: string;
  productName?: string;
  category?: string;
  industry?: Industry | string;
  useCase?: string;
  financeInterest?: boolean;
  leasingInterest?: boolean;
  selectedSupplierIds?: string[];
  selectedSuppliers?: RfqSelectedSupplier[];
  translatedMessage?: string;
  sourceLanguage?: Language;
  targetLanguage?: Language;
  buyerMessage?: string;
  responseDeadline?: string;
  createdFrom?: RfqCreatedFrom;
  budgetRange?: string;
  deliveryDate?: string;
  bundleName?: string;
  companyName?: string;
  sourcingNotes?: string;
  statusTimeline?: RfqStatusTimelineEntry[];
  leadId?: string;
  requestAlternatives?: boolean;
  relatedProductIds?: string[];
  complianceNotes?: string;
}

export interface Offer {
  id: string;
  rfqId: string;
  vertical: Vertical;
  supplierId: string;
  price: number;
  deliveryDays: number;
  availability: string;
  financeOption: string;
  leasingRateMonthly: number;
  downPayment: number;
  termMonths: number;
  monthlyCost: number;
  serviceBundle: string;
  financingStatus: "documents_missing" | "under_review" | "pre_approved" | "offer_ready";
  complianceScore: number;
  warranty: string;
  aiRecommended: boolean;
  validUntil: string;
}

export interface Order {
  id: string;
  vertical: Vertical;
  buyerId: string;
  supplierId: string;
  status: "processing" | "confirmed" | "shipped" | "partial" | "delivered";
  paymentStatus: "paid" | "pending" | "financed";
  amount: number;
  carrier: "DHL" | "DPD" | "UPS" | "FedEx";
  trackingNumber: string;
  eta: string;
  createdAt: string;
  items: number;
  country: Country;
  /** Checkout-sourced fields (mock) */
  productName?: string;
  productId?: string;
  quantity?: number;
  paymentMethod?: string;
  financeMethod?: string;
  leasingMonthly?: number;
  servicePackage?: string;
  warrantyOption?: string;
  insuranceOption?: string;
  buyerCompany?: string;
  poNumber?: string;
  documentStatus?: string;
  financeStatus?: string;
  fromCheckout?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  vertical: Vertical;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "financed";
  financingStatus: "none" | "applied" | "approved";
  buyerId: string;
}

export interface Servicepoint {
  id: string;
  vertical: Vertical;
  name: string;
  type: string;
  country: Country;
  region: string;
  categories: string[];
  serviceTypes: string[];
  responseTime: string;
  certification: string[];
  rating: number;
}

export interface MagazineItem {
  id: string;
  vertical: Vertical;
  type: "article" | "video" | "case_study" | "guide" | "comparison";
  title: LocalizedText;
  excerpt: LocalizedText;
  readTime: string;
  publishedAt: string;
  author: string;
  imageGradient: string;
}

export interface FinanceApplication {
  id: string;
  vertical: Vertical;
  company: string;
  product: string;
  amount: number;
  termMonths: number;
  type: "leasing" | "financing" | "finetrading";
  status: "documents_missing" | "under_review" | "pre_approved" | "offer_ready";
  monthlyRate: number;
  documentScore: number;
}

export interface DataRoomDocument {
  id: string;
  vertical: Vertical;
  name: string;
  category: string;
  status: "missing" | "uploaded" | "verified" | "rejected";
  uploadedAt?: string;
  required: boolean;
}

export interface Deal {
  id: string;
  vertical: Vertical;
  title: LocalizedText;
  discount: number;
  validUntil: string;
  type: "volume" | "bundle" | "promotion" | "leasing" | "service";
  supplierId: string;
  limitedStock?: number;
}

export interface AdminAlert {
  id: string;
  vertical: Vertical | "combined";
  type: string;
  message: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

export interface AdminMetrics {
  vertical: Vertical | "combined";
  revenue: number;
  revenueChange: number;
  rfqVolume: number;
  activeSuppliers: number;
  activeBuyers: number;
  marketplaceProducts: number;
  financeApplications: number;
  ordersInTransit: number;
  serviceTickets: number;
  translationQueue: number;
  onboardingPipeline: number;
  kpis: { label: string; value: string | number; change?: number }[];
}

export type NetworkEntityRole =
  | "supplier"
  | "dealer"
  | "customer"
  | "service"
  | "finance"
  | "showroom";

export type NetworkSupplierType =
  | "manufacturer"
  | "distributor"
  | "importer"
  | "wholesaler";

export type NetworkDealerType = "reseller" | "distribution_partner" | "retail_partner";

export type NetworkCustomerType =
  | "hospital"
  | "care_group"
  | "laboratory"
  | "municipality"
  | "hospitality_group"
  | "cleaning_company"
  | "industrial_site";

export type NetworkServiceType =
  | "service_partner"
  | "technician"
  | "installation"
  | "maintenance"
  | "spare_parts_hub";

export type NetworkFinanceType = "leasing_partner" | "financing_partner" | "finetrading_partner";

export type NetworkShowroomType = "showroom" | "demo_center" | "experience_center";

export interface NetworkEntity {
  id: string;
  name: string;
  role: NetworkEntityRole;
  subtype: string;
  vertical: Vertical | "both";
  country: Country;
  region: string;
  city: string;
  lat: number;
  lng: number;
  active: boolean;
  responseTime: string;
  certifications: string[];
  categories: string[];
  serviceTypes: string[];
  serviceLevel: string;
  coverageArea: string;
  contactEmail: string;
  contactPhone: string;
  products: number;
  activeRfqs: number;
  activeOrders: number;
  serviceTickets: number;
  financeAvailable: boolean;
}

export interface NetworkRoute {
  id: string;
  fromId: string;
  toId: string;
  type:
    | "supplier_dealer"
    | "dealer_customer"
    | "warehouse_customer"
    | "technician"
    | "spare_parts";
  vertical: Vertical | "both";
}

export interface NetworkIntelligenceRegion {
  region: string;
  country: Country;
  demandScore: number;
  rfqDensity: number;
  orderVolume: number;
  serviceDemand: number;
  financeDemand: number;
  status: "top" | "emerging" | "underserved" | "stable";
}
