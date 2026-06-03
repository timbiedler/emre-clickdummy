import type { Country } from "./types";

export type PaymentMethodId =
  | "invoice"
  | "sepa"
  | "credit_card"
  | "paypal"
  | "mollie"
  | "leasing"
  | "financing"
  | "finetrading"
  | "global_budget";

export interface SavedAddress {
  id: string;
  label: string;
  company: string;
  street: string;
  city: string;
  postalCode: string;
  country: Country;
  vatId: string;
  contact: string;
  phone: string;
  email: string;
}

export interface CheckoutAddOn {
  id: string;
  type: "warranty" | "insurance" | "service";
  name: string;
  monthlyCost: number;
  annualCost: number;
  description: string;
}

export interface PaymentMethodOption {
  id: PaymentMethodId;
  labelKey: string;
  descriptionKey: string;
  provider?: string;
  logoText?: string;
}

export const savedAddresses: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Head office — Berlin",
    company: "CareGroup Nord GmbH",
    street: "Friedrichstraße 112",
    city: "Berlin",
    postalCode: "10117",
    country: "Germany",
    vatId: "DE123456789",
    contact: "Anna Weber",
    phone: "+49 30 12345678",
    email: "procurement@caregroup-nord.de",
  },
  {
    id: "addr-2",
    label: "Warehouse — Munich",
    company: "CareGroup Nord GmbH",
    street: "Logistikpark 8",
    city: "Munich",
    postalCode: "80939",
    country: "Germany",
    vatId: "DE123456789",
    contact: "Logistics Team",
    phone: "+49 89 98765432",
    email: "logistics@caregroup-nord.de",
  },
];

export const warrantyOptions: CheckoutAddOn[] = [
  { id: "w-std", type: "warranty", name: "Standard warranty", monthlyCost: 0, annualCost: 0, description: "Manufacturer standard coverage" },
  { id: "w-ext", type: "warranty", name: "Extended warranty 24mo", monthlyCost: 49, annualCost: 588, description: "On-site parts & labour" },
  { id: "w-prem", type: "warranty", name: "Premium warranty 36mo", monthlyCost: 89, annualCost: 1068, description: "Priority swap & uptime SLA" },
];

export const insuranceOptions: CheckoutAddOn[] = [
  { id: "i-none", type: "insurance", name: "No device insurance", monthlyCost: 0, annualCost: 0, description: "Self-insured" },
  { id: "i-device", type: "insurance", name: "Device insurance", monthlyCost: 35, annualCost: 420, description: "Theft & accidental damage" },
  { id: "i-transport", type: "insurance", name: "Transport insurance", monthlyCost: 18, annualCost: 216, description: "Door-to-door cargo cover" },
];

export const servicePackages: CheckoutAddOn[] = [
  { id: "s-basic", type: "service", name: "Basic service", monthlyCost: 79, annualCost: 948, description: "48h response, remote support" },
  { id: "s-plus", type: "service", name: "Service Plus", monthlyCost: 149, annualCost: 1788, description: "24h on-site, spare parts pool" },
  { id: "s-fleet", type: "service", name: "Fleet maintenance", monthlyCost: 249, annualCost: 2988, description: "Dedicated technician & PM schedule" },
];

export const paymentMethods: PaymentMethodOption[] = [
  { id: "invoice", labelKey: "checkout.payByInvoice", descriptionKey: "checkout.payByInvoiceDesc" },
  { id: "sepa", labelKey: "checkout.sepaTransfer", descriptionKey: "checkout.sepaDesc", provider: "SEPA" },
  { id: "credit_card", labelKey: "checkout.creditCard", descriptionKey: "checkout.creditCardDesc", logoText: "Visa · MC" },
  { id: "paypal", labelKey: "checkout.paypal", descriptionKey: "checkout.paypalDesc", logoText: "PayPal" },
  { id: "mollie", labelKey: "checkout.mollieCheckout", descriptionKey: "checkout.mollieDesc", provider: "Mollie", logoText: "Mollie" },
  { id: "leasing", labelKey: "checkout.leasing", descriptionKey: "checkout.leasingDesc" },
  { id: "financing", labelKey: "checkout.financing", descriptionKey: "checkout.financingDesc" },
  { id: "finetrading", labelKey: "checkout.finetrading", descriptionKey: "checkout.finetradingDesc" },
  { id: "global_budget", labelKey: "checkout.globalBudget", descriptionKey: "checkout.globalBudgetDesc" },
];

export const mollieMethods = [
  { id: "mollie-card", label: "Card payment", logo: "💳" },
  { id: "mollie-sepa", label: "SEPA Direct Debit", logo: "🏦" },
  { id: "mollie-paypal", label: "PayPal", logo: "P" },
  { id: "mollie-bank", label: "Bank transfer", logo: "↔" },
  { id: "mollie-klarna", label: "Pay later (Klarna mock)", logo: "K" },
];

export const leasingTerms = [12, 24, 36, 48, 60] as const;

export const globalBudgetMock = {
  total: 500000,
  used: 187400,
  remaining: 312600,
  status: "pre_approved" as const,
};

export const requiredFinanceDocuments = [
  "BWA / management accounts",
  "Annual financial statements",
  "Bank statements (3 months)",
  "Company registration extract",
  "VAT ID certificate",
  "Procurement approval",
  "Leasing application form",
];

export const deliveryCarriers = ["DHL Freight", "DPD Business", "UPS Supply Chain", "DB Schenker"];
