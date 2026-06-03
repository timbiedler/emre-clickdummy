export type Vertical = "medical" | "robotics";

export type Language =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pl"
  | "nl"
  | "zh";

export type Country =
  | "Germany"
  | "Austria"
  | "Switzerland"
  | "France"
  | "Spain"
  | "Italy"
  | "Poland"
  | "Netherlands"
  | "Belgium"
  | "Denmark"
  | "Sweden";

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

export interface RFQ {
  id: string;
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
