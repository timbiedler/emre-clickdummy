"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GitCompare, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { ProductCard } from "@/components/emre/product-card";
import { ProductDetailDrawer } from "@/components/emre/product-detail-drawer";
import { FilterPanel, defaultFilters, type FilterState } from "@/components/emre/filter-panel";
import { SupplierProfileCard } from "@/components/emre/supplier-profile-card";
import { useApp } from "@/context/app-context";
import { getAllProducts, getProducts } from "@/data";
import {
  MEDICAL_BRANDS,
  MEDICAL_CATEGORIES,
  MEDICAL_CHANNELS,
  ROBOTICS_BRANDS,
  ROBOTICS_CATEGORIES,
  ROBOTICS_CHANNELS,
} from "@/data/constants";
import { suppliers } from "@/data/suppliers";
import { t as localizedText } from "@/lib/i18n";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getIndustryRelevanceScore,
  sortProductsByRelevance,
} from "@/lib/industry-relevance";
import { useUi } from "@/lib/ui-i18n";
import { useSourcing } from "@/context/sourcing-context";
import { getProductFinance } from "@/lib/product-finance";

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const {
    vertical,
    language,
    compareList,
    clearCompare,
    industry,
    showRelevantFirst,
    includeAllProducts,
  } = useApp();
  const { t } = useUi();
  const { openCreateGapDrawer, recordFailedSearch } = useSourcing();

  const catalog = includeAllProducts ? getAllProducts() : getProducts(vertical);
  const maxPrice = Math.max(...catalog.map((p) => p.price), 1);
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(maxPrice));
  const [selected, setSelected] = useState<Product | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  const productFromUrl = useMemo(() => {
    const productId = searchParams.get("productId");
    return productId ? catalog.find((p) => p.id === productId) ?? null : null;
  }, [searchParams, catalog]);

  const supplierFromUrl = searchParams.get("supplierId");
  const searchFromUrl = searchParams.get("search");
  const activeProduct = selected ?? productFromUrl;
  const activeSupplierId = supplierId ?? supplierFromUrl;
  const filtersWithUrl = useMemo(
    () => (searchFromUrl ? { ...filters, search: searchFromUrl } : filters),
    [filters, searchFromUrl]
  );

  const brands = includeAllProducts
    ? [...MEDICAL_BRANDS, ...ROBOTICS_BRANDS]
    : vertical === "medical"
      ? MEDICAL_BRANDS
      : ROBOTICS_BRANDS;
  const categories = includeAllProducts
    ? [...MEDICAL_CATEGORIES, ...ROBOTICS_CATEGORIES]
    : vertical === "medical"
      ? MEDICAL_CATEGORIES
      : ROBOTICS_CATEGORIES;
  const channels = includeAllProducts
    ? [...MEDICAL_CHANNELS, ...ROBOTICS_CHANNELS]
    : vertical === "medical"
      ? MEDICAL_CHANNELS
      : ROBOTICS_CHANNELS;

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (filtersWithUrl.search) {
      const q = filtersWithUrl.search.toLowerCase();
      result = result.filter(
        (p) =>
          localizedText(p.name, language).toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (filtersWithUrl.brands.length) result = result.filter((p) => filtersWithUrl.brands.includes(p.brand));
    if (filtersWithUrl.categories.length) result = result.filter((p) => filtersWithUrl.categories.includes(p.category));
    if (filtersWithUrl.channels.length) result = result.filter((p) => p.salesChannels.some((c) => filtersWithUrl.channels.includes(c)));
    if (filtersWithUrl.countries.length) result = result.filter((p) => p.countries.some((c) => filtersWithUrl.countries.includes(c)));
    if (filtersWithUrl.availability.length) result = result.filter((p) => filtersWithUrl.availability.includes(p.availability));
    if (filtersWithUrl.financeOnly) result = result.filter((p) => p.financeAvailable);
    if (filtersWithUrl.serviceCoverage) result = result.filter((p) => p.serviceCoverage);
    if (filtersWithUrl.certifiedOnly) result = result.filter((p) => p.documents.some((d) => d.status === "verified"));
    result = result.filter((p) => p.price >= filtersWithUrl.priceRange[0] && p.price <= filtersWithUrl.priceRange[1]);

    const filterIndustry = filtersWithUrl.industry !== "all" ? filtersWithUrl.industry : industry;

    if (filtersWithUrl.sort === "relevance" || showRelevantFirst) {
      result = sortProductsByRelevance(result, filterIndustry as typeof industry, showRelevantFirst || filtersWithUrl.sort === "relevance");
    }
    if (filtersWithUrl.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filtersWithUrl.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filtersWithUrl.sort === "delivery") result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    if (filtersWithUrl.sort === "leasing") {
      result.sort(
        (a, b) =>
          getProductFinance(a).leasingRateMonthly - getProductFinance(b).leasingRateMonthly
      );
    }
    if (filtersWithUrl.sort === "popularity") {
      result.sort((a, b) => b.stock - a.stock);
    }
    if (filtersWithUrl.search && result.length === 0) recordFailedSearch(filtersWithUrl.search);
    return result;
  }, [catalog, filtersWithUrl, language, industry, showRelevantFirst, recordFailedSearch]);

  const aiRecommended = useMemo(
    () =>
      [...catalog]
        .sort(
          (a, b) =>
            getIndustryRelevanceScore(b, industry) - getIndustryRelevanceScore(a, industry)
        )
        .slice(0, 3),
    [catalog, industry]
  );

  const crossIndustry = useMemo(
    () =>
      filtered
        .filter((p) => getIndustryRelevanceScore(p, industry) < 50)
        .slice(0, 4),
    [filtered, industry]
  );

  const selectedSupplier = suppliers.find((s) => s.id === activeSupplierId);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="marketplace.title"
        description={`${filtered.length} products — ${industry}`}
        action={
          compareList.length > 0 && (
            <Button variant="outline" className="gap-2" onClick={clearCompare}>
              <GitCompare className="size-4" /> {t("common.compare")} ({compareList.length})
              <X className="size-3 ml-1" />
            </Button>
          )
        }
      />

      {showRelevantFirst && aiRecommended.length > 0 && (
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-blue-600" /> {t("marketplace.aiRecommended")}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {aiRecommended.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelected(product)}
                showRelevance
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            brands={brands}
            categories={categories}
            channels={channels}
            maxPrice={maxPrice}
          />
        </div>
        <div className="lg:col-span-3 space-y-6">
          {filtersWithUrl.search && filtered.length === 0 && (
            <div className="surface-card rounded-xl p-6 border border-amber-200 bg-amber-50 text-center space-y-3">
              <p className="text-sm text-amber-900">{t("sourcing.noSearchResults")}</p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  openCreateGapDrawer({
                    source: "marketplace_search",
                    requestedProduct: filtersWithUrl.search,
                    urgency: "high",
                  })
                }
              >
                {t("sourcing.createGapRequest")}
              </Button>
            </div>
          )}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelected(product)}
                selected={compareList.includes(product.id)}
                showRelevance
              />
            ))}
          </div>

          {includeAllProducts && crossIndustry.length > 0 && (
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-slate-900 mb-1">{t("marketplace.crossIndustry")}</p>
              <p className="text-xs text-slate-500 mb-4">{t("marketplace.crossIndustryDesc")}</p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {crossIndustry.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelected(product)}
                    showRelevance
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductDetailDrawer
        product={activeProduct}
        open={!!activeProduct}
        onClose={() => setSelected(null)}
        onViewSupplier={setSupplierId}
      />

      <Sheet open={!!activeSupplierId} onOpenChange={() => setSupplierId(null)}>
        <SheetContent className="surface-card-elevated border-slate-200">
          <SheetHeader>
            <SheetTitle>Supplier Profile</SheetTitle>
          </SheetHeader>
          {selectedSupplier && (
            <div className="mt-4">
              <SupplierProfileCard supplier={selectedSupplier} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
