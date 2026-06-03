"use client";

import { useMemo, useState } from "react";
import { GitCompare, X } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { ProductCard } from "@/components/emre/product-card";
import { ProductDetailDrawer } from "@/components/emre/product-detail-drawer";
import { FilterPanel, defaultFilters, type FilterState } from "@/components/emre/filter-panel";
import { SupplierProfileCard } from "@/components/emre/supplier-profile-card";
import { useApp } from "@/context/app-context";
import { getProducts } from "@/data";
import {
  MEDICAL_BRANDS,
  MEDICAL_CATEGORIES,
  MEDICAL_CHANNELS,
  ROBOTICS_BRANDS,
  ROBOTICS_CATEGORIES,
  ROBOTICS_CHANNELS,
} from "@/data/constants";
import { suppliers } from "@/data/suppliers";
import { t } from "@/lib/i18n";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function MarketplacePage() {
  const { vertical, language, compareList, clearCompare } = useApp();
  const products = getProducts(vertical);
  const maxPrice = Math.max(...products.map((p) => p.price));
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(maxPrice));
  const [selected, setSelected] = useState<Product | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  const brands = vertical === "medical" ? MEDICAL_BRANDS : ROBOTICS_BRANDS;
  const categories = vertical === "medical" ? MEDICAL_CATEGORIES : ROBOTICS_CATEGORIES;
  const channels = vertical === "medical" ? MEDICAL_CHANNELS : ROBOTICS_CHANNELS;

  const filtered = useMemo(() => {
    let result = [...products];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          t(p.name, language).toLowerCase().includes(q) ||
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
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "delivery") result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    return result;
  }, [products, filters, language]);

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description={`${vertical === "medical" ? "Medical Supply" : "Robotics Distribution"} — ${filtered.length} products available across EU markets`}
        action={
          compareList.length > 0 && (
            <Button variant="outline" className="gap-2" onClick={clearCompare}>
              <GitCompare className="size-4" /> Compare ({compareList.length})
              <X className="size-3 ml-1" />
            </Button>
          )
        }
      />

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
        <div className="lg:col-span-3">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelected(product)}
                selected={compareList.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <ProductDetailDrawer
        product={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onViewSupplier={setSupplierId}
      />

      <Sheet open={!!supplierId} onOpenChange={() => setSupplierId(null)}>
        <SheetContent className="glass-panel-strong border-white/10">
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
