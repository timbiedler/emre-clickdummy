"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES } from "@/data/industries";
import { EU_REGIONS, type EuRegionKey } from "@/data/eu-regions";
import { useApp } from "@/context/app-context";
import { useUi } from "@/lib/ui-i18n";
import { IndustrySelector } from "./industry-selector";

export interface FilterState {
  search: string;
  brands: string[];
  categories: string[];
  channels: string[];
  countries: string[];
  availability: string[];
  industry: string;
  financeOnly: boolean;
  serviceCoverage: boolean;
  certifiedOnly: boolean;
  priceRange: [number, number];
  sort: string;
}

export function FilterPanel({
  filters,
  onChange,
  brands,
  categories,
  channels,
  maxPrice,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  brands: string[];
  categories: string[];
  channels: string[];
  maxPrice: number;
}) {
  const {
    setCountryFilter,
    showRelevantFirst,
    setShowRelevantFirst,
    includeAllProducts,
    setIncludeAllProducts,
    industry,
    setIndustry,
  } = useApp();
  const { t, countryName } = useUi();

  const toggleArray = (key: keyof FilterState, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const regionKeys = Object.keys(EU_REGIONS) as EuRegionKey[];

  return (
    <div className="surface-card rounded-xl p-4 space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="size-4 text-blue-600" />
        {t("common.filters")}
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">{t("enter.industryContext")}</Label>
        <IndustrySelector />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t("common.search")}
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9 surface-card border-slate-200"
        />
      </div>

      <Select
        value={filters.sort}
        onValueChange={(v) => onChange({ ...filters, sort: v })}
      >
        <SelectTrigger className="surface-card border-slate-200">
          <SelectValue placeholder={t("marketplace.sortRelevance")} />
        </SelectTrigger>
        <SelectContent className="surface-card-elevated border-slate-200">
          <SelectItem value="relevance">{t("marketplace.sortRelevance")}</SelectItem>
          <SelectItem value="price-asc">{t("marketplace.sortPriceAsc")}</SelectItem>
          <SelectItem value="price-desc">{t("marketplace.sortPriceDesc")}</SelectItem>
          <SelectItem value="leasing">{t("marketplace.sortLeasing")}</SelectItem>
          <SelectItem value="delivery">{t("marketplace.sortDelivery")}</SelectItem>
          <SelectItem value="popularity">{t("marketplace.sortPopularity")}</SelectItem>
        </SelectContent>
      </Select>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
        <FilterCheck
          label={t("common.showRelevantFirst")}
          checked={showRelevantFirst}
          onChange={() => setShowRelevantFirst(!showRelevantFirst)}
        />
        <FilterCheck
          label={t("common.includeAllProducts")}
          checked={includeAllProducts}
          onChange={() => setIncludeAllProducts(!includeAllProducts)}
        />
      </div>

      <Select
        value={filters.industry || industry}
        onValueChange={(v) => {
          onChange({ ...filters, industry: v });
          setIndustry(v as typeof industry);
        }}
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder={t("marketplace.industryFilter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("marketplace.allIndustries")}</SelectItem>
          {INDUSTRIES.map((ind) => (
            <SelectItem key={ind} value={ind}>
              {ind}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FilterGroup title={t("marketplace.brand")}>
        {brands.slice(0, 8).map((b) => (
          <FilterCheck
            key={b}
            label={b}
            checked={filters.brands.includes(b)}
            onChange={() => toggleArray("brands", b)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t("marketplace.category")}>
        {categories.map((c) => (
          <FilterCheck
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onChange={() => toggleArray("categories", c)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t("marketplace.salesChannel")}>
        {channels.slice(0, 6).map((c) => (
          <FilterCheck
            key={c}
            label={c}
            checked={filters.channels.includes(c)}
            onChange={() => toggleArray("channels", c)}
          />
        ))}
      </FilterGroup>

      {regionKeys.map((regionKey) => (
        <FilterGroup key={regionKey} title={t(`regions.${regionKey}`)}>
          {EU_REGIONS[regionKey].map((c) => (
            <FilterCheck
              key={c}
              label={countryName(c)}
              checked={filters.countries.includes(c)}
              onChange={() => {
                toggleArray("countries", c);
                setCountryFilter(c);
              }}
            />
          ))}
        </FilterGroup>
      ))}

      <FilterGroup title={t("common.availability")}>
        {["in_stock", "limited", "preorder"].map((a) => (
          <FilterCheck
            key={a}
            label={a.replace("_", " ")}
            checked={filters.availability.includes(a)}
            onChange={() => toggleArray("availability", a)}
          />
        ))}
      </FilterGroup>

      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">
          €{filters.priceRange[0]} – €{filters.priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={filters.priceRange}
          onValueChange={(v) =>
            onChange({ ...filters, priceRange: v as [number, number] })
          }
        />
      </div>

      <FilterCheck
        label={t("marketplace.leasingAvailable")}
        checked={filters.financeOnly}
        onChange={() => onChange({ ...filters, financeOnly: !filters.financeOnly })}
      />
      <FilterCheck
        label={t("marketplace.serviceCoverage")}
        checked={filters.serviceCoverage}
        onChange={() =>
          onChange({ ...filters, serviceCoverage: !filters.serviceCoverage })
        }
      />
      <FilterCheck
        label={t("marketplace.verifiedCerts")}
        checked={filters.certifiedOnly}
        onChange={() =>
          onChange({ ...filters, certifiedOnly: !filters.certifiedOnly })
        }
      />
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">{children}</div>
    </div>
  );
}

function FilterCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={label} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={label} className="text-xs cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

export const defaultFilters = (maxPrice: number): FilterState => ({
  search: "",
  brands: [],
  categories: [],
  channels: [],
  countries: [],
  availability: [],
  industry: "all",
  financeOnly: false,
  serviceCoverage: false,
  certifiedOnly: false,
  priceRange: [0, maxPrice],
  sort: "relevance",
});
