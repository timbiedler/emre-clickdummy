"use client";

import { useMemo, useState } from "react";
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
import { getProductFinance } from "@/lib/product-finance";

export default function MarketplacePage() {
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

  const catalog = includeAllProducts ? getAllProducts() : getProducts(vertical);
  const maxPrice = Math.max(...catalog.map((p) => p.price), 1);
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(maxPrice));
  const [selected, setSelected] = useState<Product | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

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
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          localizedText(p.name, language).toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (filters.brands.length) result = result.filter((p) => filters.brands.includes(p.brand));
    if (filters.categories.length) result = result.filter((p) => filters.categories.includes(p.category));
    if (filters.channels.length) result = result.filter((p) => p.salesChannels.some((c) => filters.channels.includes(c)));
    if (filters.countries.length) result = result.filter((p) => p.countries.some((c) => filters.countries.includes(c)));
    if (filters.availability.length) result = result.filter((p) => filters.availability.includes(p.availability));
    if (filters.financeOnly) result = result.filter((p) => p.financeAvailable);
    if (filters.serviceCoverage) result = result.filter((p) => p.serviceCoverage);
    if (filters.certifiedOnly) result = result.filter((p) => p.documents.some((d) => d.status === "verified"));
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    const filterIndustry = filters.industry !== "all" ? filters.industry : industry;

    if (filters.sort === "relevance" || showRelevantFirst) {
      result = sortProductsByRelevance(result, filterIndustry as typeof industry, showRelevantFirst || filters.sort === "relevance");
    }
    if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "delivery") result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    if (filters.sort === "leasing") {
      result.sort(
        (a, b) =>
          getProductFinance(a).leasingRateMonthly - getProductFinance(b).leasingRateMonthly
      );
    }
    if (filters.sort === "popularity") {
      result.sort((a, b) => b.stock - a.stock);
    }
    return result;
  }, [catalog, filters, language, industry, showRelevantFirst]);

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

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

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
        product={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onViewSupplier={setSupplierId}
      />

      <Sheet open={!!supplierId} onOpenChange={() => setSupplierId(null)}>
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
