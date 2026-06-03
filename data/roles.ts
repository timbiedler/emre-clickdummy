import type { UserRole } from "./types";

export type NavIconName =
  | "LayoutDashboard"
  | "Store"
  | "Sparkles"
  | "FileText"
  | "Tag"
  | "Newspaper"
  | "CreditCard"
  | "Package"
  | "Wrench"
  | "Globe"
  | "User"
  | "FolderLock"
  | "Truck"
  | "Shield"
  | "Handshake"
  | "Users"
  | "Briefcase"
  | "Warehouse"
  | "Megaphone"
  | "Receipt"
  | "ClipboardList"
  | "UserCog"
  | "TrendingUp";

export interface RoleNavItem {
  href: string;
  labelKey: string;
  icon: NavIconName;
}

export const ROLE_NAVIGATION: Record<UserRole, RoleNavItem[]> = {
  admin: [
    { href: "/", labelKey: "nav.commandCenter", icon: "LayoutDashboard" },
    { href: "/marketplace", labelKey: "nav.marketplace", icon: "Store" },
    { href: "/rfq", labelKey: "nav.rfqCenter", icon: "FileText" },
    { href: "/offers", labelKey: "nav.offers", icon: "ClipboardList" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/finance", labelKey: "nav.financePipeline", icon: "CreditCard" },
    { href: "/data-room", labelKey: "nav.dataRoomVerification", icon: "FolderLock" },
    { href: "/supplier", labelKey: "nav.supplierOnboarding", icon: "Truck" },
    { href: "/admin/sales-partners", labelKey: "nav.salesPartnerOnboarding", icon: "Handshake" },
    { href: "/service-network", labelKey: "nav.serviceNetwork", icon: "Wrench" },
    { href: "/network-map", labelKey: "nav.networkMap", icon: "Globe" },
    { href: "/admin", labelKey: "nav.adminKpis", icon: "Shield" },
    { href: "/admin/sourcing-desk", labelKey: "nav.sourcingDesk", icon: "ClipboardList" },
    { href: "/admin/growth", labelKey: "nav.growthTerritory", icon: "Globe" },
    { href: "/admin/users", labelKey: "nav.usersRoles", icon: "UserCog" },
    { href: "/admin/growth", labelKey: "nav.growthTerritory", icon: "TrendingUp" },
  ],
  customer: [
    { href: "/", labelKey: "nav.dashboard", icon: "LayoutDashboard" },
    { href: "/marketplace", labelKey: "nav.marketplace", icon: "Store" },
    { href: "/assistant", labelKey: "nav.aiAssistant", icon: "Sparkles" },
    { href: "/rfq", labelKey: "nav.rfqCenter", icon: "FileText" },
    { href: "/offers", labelKey: "nav.offers", icon: "ClipboardList" },
    { href: "/deals", labelKey: "nav.deals", icon: "Tag" },
    { href: "/magazine", labelKey: "nav.magazine", icon: "Newspaper" },
    { href: "/finance", labelKey: "nav.leasingFinance", icon: "CreditCard" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/account", labelKey: "nav.invoicesAccount", icon: "Receipt" },
    { href: "/data-room", labelKey: "nav.dataRoom", icon: "FolderLock" },
    { href: "/service-network", labelKey: "nav.serviceNetwork", icon: "Wrench" },
    { href: "/network-map", labelKey: "nav.networkMap", icon: "Globe" },
  ],
  supplier: [
    { href: "/supplier", labelKey: "nav.supplierDashboard", icon: "LayoutDashboard" },
    { href: "/marketplace", labelKey: "nav.productCatalog", icon: "Store" },
    { href: "/rfq", labelKey: "nav.rfqInbox", icon: "FileText" },
    { href: "/offers", labelKey: "nav.offers", icon: "ClipboardList" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/data-room", labelKey: "nav.documentsCertificates", icon: "FolderLock" },
    { href: "/supplier/performance", labelKey: "nav.performance", icon: "Briefcase" },
  ],
  dealer: [
    { href: "/dealer", labelKey: "nav.dealerDashboard", icon: "LayoutDashboard" },
    { href: "/marketplace", labelKey: "nav.marketplaceAssortments", icon: "Store" },
    { href: "/dealer/leads", labelKey: "nav.leads", icon: "Users" },
    { href: "/offers", labelKey: "nav.offers", icon: "ClipboardList" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/finance", labelKey: "nav.leasingFinance", icon: "CreditCard" },
    { href: "/service-network", labelKey: "nav.serviceNetwork", icon: "Wrench" },
    { href: "/dealer/campaigns", labelKey: "nav.campaigns", icon: "Megaphone" },
    { href: "/dealer/performance", labelKey: "nav.performance", icon: "Briefcase" },
  ],
  sales_partner: [
    { href: "/sales-partner", labelKey: "nav.partnerDashboard", icon: "LayoutDashboard" },
    { href: "/sales-partner/onboarding", labelKey: "nav.partnerOnboarding", icon: "Handshake" },
    { href: "/sales-partner/leads", labelKey: "nav.assignedLeads", icon: "Users" },
    { href: "/rfq", labelKey: "nav.rfqCenter", icon: "FileText" },
    { href: "/offers", labelKey: "nav.customerOffers", icon: "ClipboardList" },
    { href: "/sales-partner/pipeline", labelKey: "nav.pipeline", icon: "Briefcase" },
    { href: "/marketplace", labelKey: "nav.productAssortments", icon: "Store" },
    { href: "/sales-partner/touchpoints", labelKey: "nav.campaignTouchpoints", icon: "Megaphone" },
    { href: "/sales-partner/commissions", labelKey: "nav.commissions", icon: "CreditCard" },
    { href: "/network-map", labelKey: "nav.networkMap", icon: "Globe" },
    { href: "/sales-partner/performance", labelKey: "nav.performance", icon: "Briefcase" },
  ],
  service_partner: [
    { href: "/service-partner", labelKey: "nav.serviceDashboard", icon: "LayoutDashboard" },
    { href: "/service-partner/tickets", labelKey: "nav.tickets", icon: "ClipboardList" },
    { href: "/service-partner/requests", labelKey: "nav.serviceRequests", icon: "FileText" },
    { href: "/service-partner/spare-parts", labelKey: "nav.spareParts", icon: "Package" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/network-map", labelKey: "nav.networkMap", icon: "Globe" },
    { href: "/service-partner/performance", labelKey: "nav.performance", icon: "Briefcase" },
  ],
  finance_partner: [
    { href: "/finance-partner", labelKey: "nav.financeDashboard", icon: "LayoutDashboard" },
    { href: "/finance-partner/applications", labelKey: "nav.applications", icon: "FileText" },
    { href: "/data-room", labelKey: "nav.dataRoom", icon: "FolderLock" },
    { href: "/finance", labelKey: "nav.leasingFinance", icon: "CreditCard" },
    { href: "/finance-partner/portfolio", labelKey: "nav.portfolio", icon: "Briefcase" },
  ],
  agency: [
    { href: "/agency", labelKey: "nav.agencyDashboard", icon: "LayoutDashboard" },
    { href: "/agency/campaigns", labelKey: "nav.campaigns", icon: "Megaphone" },
    { href: "/agency/leads", labelKey: "nav.leads", icon: "Users" },
    { href: "/magazine", labelKey: "nav.magazineContent", icon: "Newspaper" },
    { href: "/marketplace", labelKey: "nav.productAssets", icon: "Store" },
    { href: "/agency/performance", labelKey: "nav.performance", icon: "Briefcase" },
  ],
  logistics: [
    { href: "/logistics", labelKey: "nav.logisticsDashboard", icon: "LayoutDashboard" },
    { href: "/logistics/stock", labelKey: "nav.stock", icon: "Warehouse" },
    { href: "/logistics/shipments", labelKey: "nav.shipments", icon: "Truck" },
    { href: "/orders", labelKey: "nav.ordersTracking", icon: "Package" },
    { href: "/logistics/returns", labelKey: "nav.returns", icon: "ClipboardList" },
    { href: "/network-map", labelKey: "nav.warehouseMap", icon: "Globe" },
  ],
};

export function getNavForRole(role: UserRole): RoleNavItem[] {
  return ROLE_NAVIGATION[role];
}

export function getHomeForRole(role: UserRole): string {
  const nav = ROLE_NAVIGATION[role];
  return nav[0]?.href ?? "/";
}

export const USER_ROLES: UserRole[] = [
  "admin",
  "customer",
  "supplier",
  "dealer",
  "sales_partner",
  "service_partner",
  "finance_partner",
  "agency",
  "logistics",
];
