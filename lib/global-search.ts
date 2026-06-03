import { getAllProducts } from "@/data";
import { buyers } from "@/data/buyers";
import { platformConnectors } from "@/data/connectors";
import { dataRoomDocuments } from "@/data/data-room";
import { deals } from "@/data/deals";
import { financeApplications } from "@/data/finance";
import {
  growthBundles,
  growthCampaigns,
  growthLeads,
  growthSignals,
} from "@/data/growth";
import { growthEmailSequences } from "@/data/growth-outreach";
import { invoices } from "@/data/invoices";
import { magazineItems } from "@/data/magazine";
import { offers } from "@/data/offers";
import { orders } from "@/data/orders";
import { rfqs } from "@/data/rfqs";
import { salesPartners } from "@/data/sales-partners";
import { demandGaps, productGapRequests } from "@/data/sourcing";
import { servicepoints } from "@/data/servicepoints";
import { suppliers } from "@/data/suppliers";
import { trainingCourses } from "@/data/training";
import type { Industry, Language, Product, UserRole, Vertical } from "@/data/types";
import { t as localizedText } from "@/lib/i18n";
import { getProductIndustries } from "@/lib/industry-relevance";
import { hasPermission, type PERMISSION_MODULES } from "@/lib/permissions";

export type SearchScope =
  | "current_view"
  | "marketplace"
  | "rfqs"
  | "orders"
  | "finance"
  | "data_room"
  | "suppliers"
  | "sales_partners"
  | "service_network"
  | "leads"
  | "magazine"
  | "training"
  | "connectors"
  | "all";

export type SearchResultGroup =
  | "products"
  | "rfqs"
  | "orders"
  | "finance"
  | "documents"
  | "suppliers"
  | "partners"
  | "leads"
  | "campaigns"
  | "magazine"
  | "training"
  | "network"
  | "sourcing";

export type SearchEntityType =
  | "product"
  | "category"
  | "brand"
  | "buyer"
  | "rfq"
  | "offer"
  | "order"
  | "invoice"
  | "finance"
  | "document"
  | "supplier"
  | "sales_partner"
  | "servicepoint"
  | "lead"
  | "campaign"
  | "signal"
  | "magazine"
  | "training"
  | "connector"
  | "webhook"
  | "sourcing_gap"
  | "sourcing_request"
  | "group_buy"
  | "warranty"
  | "deal";

export interface GlobalSearchResult {
  id: string;
  entityType: SearchEntityType;
  group: SearchResultGroup;
  title: string;
  description: string;
  status?: string;
  country?: string;
  industry?: string;
  vertical?: Vertical | "combined";
  badgeKey: string;
  href: string;
  quickActionKey?: string;
  quickActionHref?: string;
  score: number;
}

export interface GlobalSearchOptions {
  query: string;
  scope: SearchScope;
  role: UserRole;
  language: Language;
  vertical: Vertical;
  industry: Industry;
  pathname: string;
  includeAllProducts: boolean;
  limit?: number;
}

type PermissionModule = (typeof PERMISSION_MODULES)[number];

const GROWTH_ROLES: UserRole[] = ["admin", "sales_partner", "dealer", "agency", "customer"];

const ENTITY_MODULE: Partial<Record<SearchEntityType, PermissionModule>> = {
  product: "Marketplace",
  category: "Marketplace",
  brand: "Marketplace",
  buyer: "Marketplace",
  rfq: "RFQ Center",
  offer: "Offers",
  order: "Orders",
  invoice: "Finance",
  finance: "Finance",
  document: "Data Room",
  supplier: "Marketplace",
  sales_partner: "Sales Partners",
  servicepoint: "Service Network",
  deal: "Marketplace",
  magazine: "Marketplace",
  training: "Marketplace",
};

const SCOPE_GROUPS: Record<Exclude<SearchScope, "all" | "current_view">, SearchResultGroup[]> = {
  marketplace: ["products"],
  rfqs: ["rfqs"],
  orders: ["orders"],
  finance: ["finance"],
  data_room: ["documents"],
  suppliers: ["suppliers"],
  sales_partners: ["partners"],
  service_network: ["network"],
  leads: ["leads", "campaigns"],
  magazine: ["magazine"],
  training: ["training"],
  connectors: ["network"],
};

const ALL_GROUP_ORDER: SearchResultGroup[] = [
  "products",
  "rfqs",
  "orders",
  "finance",
  "documents",
  "suppliers",
  "partners",
  "leads",
  "campaigns",
  "magazine",
  "training",
  "network",
  "sourcing",
];

export const SEARCH_SCOPE_KEYS: SearchScope[] = [
  "current_view",
  "marketplace",
  "rfqs",
  "orders",
  "finance",
  "data_room",
  "suppliers",
  "sales_partners",
  "service_network",
  "leads",
  "magazine",
  "training",
  "connectors",
  "all",
];

export const SUGGESTED_SEARCH_KEYS = [
  "globalSearch.suggestedQueries.cleaningRobots",
  "globalSearch.suggestedQueries.hospitalRfq",
  "globalSearch.suggestedQueries.leasingGermany",
  "globalSearch.suggestedQueries.sourcingGap",
  "globalSearch.suggestedQueries.partnerPipeline",
] as const;

const RECENT_KEY = "emre-global-search-recent";
const MAX_RECENT = 8;

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(query: string): string[] {
  const n = normalizeSearchText(query);
  return n ? n.split(" ").filter(Boolean) : [];
}

function matchesTokens(
  tokens: string[],
  fields: (string | undefined)[]
): { match: boolean; score: number } {
  if (tokens.length === 0) return { match: true, score: 0 };
  const hay = normalizeSearchText(fields.filter(Boolean).join(" "));
  let score = 0;
  for (const token of tokens) {
    if (!hay.includes(token)) return { match: false, score: 0 };
    if (hay.startsWith(token)) score += 3;
    else score += 1;
  }
  return { match: true, score };
}

export function getScopeFromPathname(pathname: string): Exclude<SearchScope, "current_view"> {
  if (pathname.startsWith("/marketplace") || pathname.startsWith("/assistant")) return "marketplace";
  if (pathname.startsWith("/rfq")) return "rfqs";
  if (pathname.startsWith("/orders")) return "orders";
  if (pathname.startsWith("/finance")) return "finance";
  if (pathname.startsWith("/data-room")) return "data_room";
  if (pathname.startsWith("/admin/sourcing")) return "all";
  if (pathname.startsWith("/admin/growth")) return "leads";
  if (pathname.startsWith("/magazine")) return "magazine";
  if (pathname.startsWith("/training")) return "training";
  if (pathname.startsWith("/service-network")) return "service_network";
  if (pathname.startsWith("/admin/sales-partners") || pathname.startsWith("/sales-partner"))
    return "sales_partners";
  if (pathname.startsWith("/supplier")) return "suppliers";
  if (pathname.startsWith("/search")) return "all";
  return "all";
}

function canAccessEntity(role: UserRole, entityType: SearchEntityType): boolean {
  if (entityType === "connector" || entityType === "webhook") return role === "admin";
  if (
    entityType === "lead" ||
    entityType === "campaign" ||
    entityType === "signal" ||
    entityType === "group_buy"
  ) {
    return GROWTH_ROLES.includes(role);
  }
  if (entityType === "sourcing_gap" || entityType === "sourcing_request") {
    return role === "admin";
  }
  const mod = ENTITY_MODULE[entityType];
  if (!mod) return true;
  return hasPermission(role, mod, "view");
}

function industryBoost(industry: Industry, product: Product): number {
  const { primary } = getProductIndustries(product);
  return primary.includes(industry) ? 2 : 0;
}

function buildCatalog(language: Language, includeAllProducts: boolean, vertical: Vertical): GlobalSearchResult[] {
  const products = includeAllProducts ? getAllProducts() : getAllProducts().filter((p) => p.vertical === vertical);
  const results: GlobalSearchResult[] = [];

  const brands = new Set<string>();
  const categories = new Set<string>();

  for (const p of products) {
    brands.add(p.brand);
    categories.add(p.category);
    const name = localizedText(p.name, language);
    results.push({
      id: p.id,
      entityType: "product",
      group: "products",
      title: name,
      description: `${p.brand} · ${p.category} · ${p.supplierName}`,
      status: p.availability,
      country: p.primaryCountry,
      industry: p.category,
      vertical: p.vertical,
      badgeKey: "globalSearch.badge.product",
      href: `/marketplace?productId=${p.id}`,
      quickActionKey: "globalSearch.action.openProduct",
      quickActionHref: `/marketplace?productId=${p.id}`,
      score: 0,
    });
  }

  for (const brand of brands) {
    results.push({
      id: `brand-${normalizeSearchText(brand)}`,
      entityType: "brand",
      group: "products",
      title: brand,
      description: "Brand catalog",
      badgeKey: "globalSearch.badge.brand",
      href: `/marketplace?search=${encodeURIComponent(brand)}`,
      score: 0,
    });
  }

  for (const cat of categories) {
    results.push({
      id: `cat-${normalizeSearchText(cat)}`,
      entityType: "category",
      group: "products",
      title: cat,
      description: "Product category",
      badgeKey: "globalSearch.badge.category",
      href: `/marketplace?search=${encodeURIComponent(cat)}`,
      score: 0,
    });
  }

  return results;
}

function buildIndex(language: Language, vertical: Vertical, includeAllProducts: boolean): GlobalSearchResult[] {
  const catalog = buildCatalog(language, includeAllProducts, vertical);
  const productList = includeAllProducts ? getAllProducts() : getAllProducts().filter((p) => p.vertical === vertical);

  const rfqResults: GlobalSearchResult[] = rfqs.map((r) => ({
    id: r.id,
    entityType: "rfq",
    group: "rfqs",
    title: localizedText(r.title, language),
    description: `${r.deliveryCountry} · ${r.matchedSuppliers} suppliers · ${r.offersCount} offers`,
    status: r.status,
    country: r.deliveryCountry,
    vertical: r.vertical,
    badgeKey: "globalSearch.badge.rfq",
    href: `/rfq?rfqId=${r.id}`,
    quickActionKey: "globalSearch.action.openRfq",
    quickActionHref: `/rfq?rfqId=${r.id}`,
    score: 0,
  }));

  const orderResults: GlobalSearchResult[] = orders.map((o) => ({
    id: o.id,
    entityType: "order",
    group: "orders",
    title: `Order ${o.id.toUpperCase()}`,
    description: `${o.items} items · ${o.carrier} · ${o.paymentStatus}`,
    status: o.status,
    country: o.country,
    vertical: o.vertical,
    badgeKey: "globalSearch.badge.order",
    href: `/orders?orderId=${o.id}`,
    quickActionKey: "globalSearch.action.trackOrder",
    quickActionHref: `/orders?orderId=${o.id}`,
    score: 0,
  }));

  const financeResults: GlobalSearchResult[] = [
    ...financeApplications.map((f) => ({
      id: f.id,
      entityType: "finance" as const,
      group: "finance" as const,
      title: f.company,
      description: `${f.product} · ${f.type} · €${f.amount.toLocaleString()}`,
      status: f.status,
      vertical: f.vertical,
      badgeKey: "globalSearch.badge.finance",
      href: `/finance?applicationId=${f.id}`,
      quickActionKey: "globalSearch.action.reviewFinance",
      quickActionHref: `/finance?applicationId=${f.id}`,
      score: 0,
    })),
    ...invoices.map((inv) => ({
      id: inv.id,
      entityType: "invoice" as const,
      group: "finance" as const,
      title: inv.invoiceNumber,
      description: `Order ${inv.orderId} · €${inv.amount.toLocaleString()}`,
      status: inv.status,
      vertical: inv.vertical,
      badgeKey: "globalSearch.badge.invoice",
      href: `/finance?invoiceId=${inv.id}`,
      score: 0,
    })),
    ...offers.map((o) => ({
      id: o.id,
      entityType: "offer" as const,
      group: "finance" as const,
      title: `Offer ${o.id}`,
      description: `RFQ ${o.rfqId} · €${o.price.toLocaleString()} · ${o.financeOption}`,
      status: o.financingStatus,
      vertical: o.vertical,
      badgeKey: "globalSearch.badge.offer",
      href: `/offers?offerId=${o.id}`,
      score: 0,
    })),
  ];

  const docResults: GlobalSearchResult[] = dataRoomDocuments.map((d) => ({
    id: d.id,
    entityType: "document",
    group: "documents",
    title: d.name,
    description: d.category,
    status: d.status,
    vertical: d.vertical,
    badgeKey: "globalSearch.badge.document",
    href: `/data-room?docId=${d.id}`,
    quickActionKey: "globalSearch.action.openDocument",
    quickActionHref: `/data-room?docId=${d.id}`,
    score: 0,
  }));

  const supplierResults: GlobalSearchResult[] = suppliers.map((s) => ({
    id: s.id,
    entityType: "supplier",
    group: "suppliers",
    title: s.name,
    description: localizedText(s.description, language).slice(0, 120),
    status: s.onboardingStatus,
    country: s.country,
    vertical: s.vertical,
    badgeKey: "globalSearch.badge.supplier",
    href: `/marketplace?supplierId=${s.id}`,
    quickActionKey: "globalSearch.action.viewSupplier",
    quickActionHref: `/marketplace?supplierId=${s.id}`,
    score: 0,
  }));

  const partnerResults: GlobalSearchResult[] = salesPartners.map((p) => ({
    id: p.id,
    entityType: "sales_partner",
    group: "partners",
    title: p.name,
    description: `${p.type} · ${p.countries.join(", ")}`,
    status: p.approvalStatus,
    country: p.countries[0],
    industry: p.industries[0],
    badgeKey: "globalSearch.badge.partner",
    href: `/admin/sales-partners?partnerId=${p.id}`,
    score: 0,
  }));

  const leadResults: GlobalSearchResult[] = growthLeads.map((l) => ({
    id: l.id,
    entityType: "lead",
    group: "leads",
    title: l.company,
    description: `${l.source} · ${l.signal ?? "—"} · ${l.owner}`,
    status: l.status,
    country: l.country,
    industry: l.industry,
    vertical: l.vertical,
    badgeKey: "globalSearch.badge.lead",
    href: `/admin/growth?leadId=${l.id}&tab=leads`,
    quickActionKey: "globalSearch.action.openLead",
    quickActionHref: `/admin/growth?leadId=${l.id}&tab=leads`,
    score: 0,
  }));

  const campaignResults: GlobalSearchResult[] = growthCampaigns.map((c) => ({
    id: c.id,
    entityType: "campaign",
    group: "campaigns",
    title: c.name,
    description: `${c.type} · ${c.territories.join(", ")}`,
    status: c.status,
    country: c.territories[0],
    vertical: c.vertical,
    badgeKey: "globalSearch.badge.campaign",
    href: `/admin/growth?campaignId=${c.id}&tab=campaigns`,
    score: 0,
  }));

  const signalResults: GlobalSearchResult[] = growthSignals.map((s) => ({
    id: s.id,
    entityType: "signal",
    group: "leads",
    title: s.title,
    description: s.aiRecommendation,
    status: `${s.confidence}%`,
    country: s.country,
    vertical: s.vertical,
    badgeKey: "globalSearch.badge.signal",
    href: `/admin/growth?signalId=${s.id}&tab=signals`,
    score: 0,
  }));

  const magazineResults: GlobalSearchResult[] = magazineItems.map((m) => ({
    id: m.id,
    entityType: "magazine",
    group: "magazine",
    title: localizedText(m.title, language),
    description: m.type,
    status: m.type,
    vertical: m.vertical,
    badgeKey: "globalSearch.badge.magazine",
    href: `/magazine?articleId=${m.id}`,
    score: 0,
  }));

  const trainingResults: GlobalSearchResult[] = trainingCourses.map((c) => ({
    id: c.id,
    entityType: "training",
    group: "training",
    title: localizedText(c.title, language),
    description: `${c.category} · ${c.duration}`,
    status: c.status,
    vertical: c.vertical,
    badgeKey: "globalSearch.badge.training",
    href: `/training?courseId=${c.id}`,
    score: 0,
  }));

  const networkResults: GlobalSearchResult[] = [
    ...servicepoints.map((sp) => ({
      id: sp.id,
      entityType: "servicepoint" as const,
      group: "network" as const,
      title: sp.name,
      description: `${sp.type} · ${sp.country}`,
      status: `${sp.rating.toFixed(1)}★`,
      country: sp.country,
      vertical: sp.vertical,
      badgeKey: "globalSearch.badge.servicepoint",
      href: `/service-network?pointId=${sp.id}`,
      score: 0,
    })),
    ...platformConnectors.map((c) => ({
      id: c.id,
      entityType: "connector" as const,
      group: "network" as const,
      title: c.name,
      description: c.description,
      status: c.status,
      country: c.country,
      vertical: (c.vertical === "both" ? "combined" : c.vertical) as Vertical | "combined" | undefined,
      badgeKey: "globalSearch.badge.connector",
      href: `/search?connectorId=${c.id}`,
      quickActionKey: "globalSearch.action.configure",
      quickActionHref: `/search?connectorId=${c.id}`,
      score: 0,
    })),
    ...growthEmailSequences
      .filter((_, i) => i % 4 === 0)
      .map((e) => ({
        id: e.id,
        entityType: "webhook" as const,
        group: "network" as const,
        title: `${e.name} (API)`,
        description: `Territory ${e.territory} · ${e.steps} steps`,
        status: e.status,
        country: e.territory,
        vertical: e.vertical,
        badgeKey: "globalSearch.badge.webhook",
        href: `/admin/growth?tab=outreach`,
        score: 0,
      })),
  ];

  const sourcingResults: GlobalSearchResult[] = [
    ...demandGaps.map((g) => ({
      id: g.id,
      entityType: "sourcing_gap" as const,
      group: "sourcing" as const,
      title: g.title,
      description: g.requestedProduct,
      status: g.status,
      country: g.country,
      industry: g.industry,
      vertical: g.vertical,
      badgeKey: "globalSearch.badge.demandGap",
      href: `/admin/sourcing-desk?gapId=${g.id}`,
      score: 0,
    })),
    ...productGapRequests.map((r) => ({
      id: r.id,
      entityType: "sourcing_request" as const,
      group: "sourcing" as const,
      title: r.requestedProduct,
      description: `${r.country} · ${r.source}`,
      status: r.status,
      country: r.country,
      industry: r.industry,
      vertical: r.vertical,
      badgeKey: "globalSearch.badge.sourcingRequest",
      href: `/admin/sourcing-desk?requestId=${r.id}`,
      quickActionKey: "globalSearch.action.openSourcing",
      quickActionHref: `/admin/sourcing-desk?requestId=${r.id}`,
      score: 0,
    })),
    ...productGapRequests
      .filter((r) => r.linkedGroupBuyIds.length > 0)
      .flatMap((r) =>
        r.linkedGroupBuyIds.map((gb) => ({
          id: gb,
          entityType: "group_buy" as const,
          group: "sourcing" as const,
          title: `Group buy ${gb}`,
          description: r.requestedProduct,
          status: r.status,
          country: r.country,
          badgeKey: "globalSearch.badge.groupBuy",
          href: `/admin/sourcing-desk?requestId=${r.id}`,
          score: 0,
        }))
      ),
    ...growthBundles
      .filter((b) => b.includesWarranty)
      .map((b) => ({
        id: b.id,
        entityType: "warranty" as const,
        group: "sourcing" as const,
        title: `${b.name} warranty`,
        description: b.products.join(" · "),
        status: "active",
        vertical: b.vertical,
        badgeKey: "globalSearch.badge.warranty",
        href: `/admin/growth?tab=bundles`,
        score: 0,
      })),
  ];

  const buyerResults: GlobalSearchResult[] = buyers.map((b) => ({
    id: b.id,
    entityType: "buyer",
    group: "leads",
    title: b.name,
    description: `${b.type} · ${b.country}`,
    status: b.creditStatus,
    country: b.country,
    vertical: b.vertical,
    badgeKey: "globalSearch.badge.buyer",
    href: `/network-map?buyerId=${b.id}`,
    score: 0,
  }));

  const dealResults: GlobalSearchResult[] = deals.map((d) => ({
    id: d.id,
    entityType: "deal",
    group: "campaigns",
    title: localizedText(d.title, language),
    description: `${d.type} · until ${d.validUntil}`,
    status: d.type,
    vertical: d.vertical,
    badgeKey: "globalSearch.badge.deal",
    href: `/deals?dealId=${d.id}`,
    score: 0,
  }));

  return [
    ...catalog,
    ...rfqResults,
    ...orderResults,
    ...financeResults,
    ...docResults,
    ...supplierResults,
    ...partnerResults,
    ...leadResults,
    ...campaignResults,
    ...signalResults,
    ...magazineResults,
    ...trainingResults,
    ...networkResults,
    ...sourcingResults,
    ...buyerResults,
    ...dealResults,
  ].map((r) => {
    if (r.entityType === "product") {
      const p = productList.find((x) => x.id === r.id);
      if (p) return { ...r, score: r.score };
    }
    return r;
  });
}

let cachedIndex: GlobalSearchResult[] | null = null;
let cacheKey = "";

function getIndex(language: Language, vertical: Vertical, includeAllProducts: boolean) {
  const key = `${language}-${vertical}-${includeAllProducts}`;
  if (cachedIndex && cacheKey === key) return cachedIndex;
  cachedIndex = buildIndex(language, vertical, includeAllProducts);
  cacheKey = key;
  return cachedIndex;
}

function resolveScope(
  scope: SearchScope,
  pathname: string
): Exclude<SearchScope, "current_view"> {
  return scope === "current_view" ? getScopeFromPathname(pathname) : scope;
}

function allowedGroups(scope: SearchScope, pathname: string): SearchResultGroup[] | "all" {
  const resolved = resolveScope(scope, pathname);
  if (resolved === "all") return "all";
  if (resolved === "connectors") return ["network"];
  return SCOPE_GROUPS[resolved] ?? ALL_GROUP_ORDER;
}

export function runGlobalSearch(options: GlobalSearchOptions): GlobalSearchResult[] {
  const {
    query,
    scope,
    role,
    language,
    vertical,
    industry,
    pathname,
    includeAllProducts,
    limit = scope === "all" ? 80 : 40,
  } = options;

  const tokens = tokenize(query);
  const groups = allowedGroups(scope, pathname);
  const index = getIndex(language, vertical, includeAllProducts);

  const scored: GlobalSearchResult[] = [];

  for (const item of index) {
    if (!canAccessEntity(role, item.entityType)) continue;
    if (groups !== "all" && !groups.includes(item.group)) continue;

    const { match, score } = matchesTokens(tokens, [
      item.title,
      item.description,
      item.status,
      item.country,
      item.industry,
      item.vertical,
      item.entityType,
      item.group,
    ]);
    if (!match) continue;

    let total = score;
    if (item.entityType === "product") {
      const p = getAllProducts().find((x) => x.id === item.id);
      if (p) total += industryBoost(industry, p);
    }
    if (item.vertical && item.vertical !== "combined" && item.vertical === vertical) total += 1;

    scored.push({ ...item, score: total });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

export function groupSearchResults(results: GlobalSearchResult[]): Record<SearchResultGroup, GlobalSearchResult[]> {
  const grouped = Object.fromEntries(
    ALL_GROUP_ORDER.map((g) => [g, [] as GlobalSearchResult[]])
  ) as Record<SearchResultGroup, GlobalSearchResult[]>;

  for (const r of results) {
    grouped[r.group].push(r);
  }
  return grouped;
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const q = query.trim();
  if (!q || typeof window === "undefined") return;
  const prev = getRecentSearches().filter((x) => normalizeSearchText(x) !== normalizeSearchText(q));
  const next = [q, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function buildSearchPageUrl(params: {
  q?: string;
  scope?: SearchScope;
  type?: string;
  vertical?: string;
  industry?: string;
  country?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.scope) sp.set("scope", params.scope);
  if (params.type) sp.set("type", params.type);
  if (params.vertical) sp.set("vertical", params.vertical);
  if (params.industry) sp.set("industry", params.industry);
  if (params.country) sp.set("country", params.country);
  const qs = sp.toString();
  return qs ? `/search?${qs}` : "/search";
}
