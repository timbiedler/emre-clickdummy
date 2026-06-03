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
import { COUNTRIES } from "@/data/constants";
import { useApp } from "@/context/app-context";

export interface FilterState {
  search: string;
  brands: string[];
  categories: string[];
  channels: string[];
  countries: string[];
  availability: string[];
  financeOnly: boolean;
  serviceCoverage: boolean;
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
  const { setCountryFilter } = useApp();

  const toggleArray = (key: keyof FilterState, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="size-4 text-cyan-400" />
        Filters
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9 glass-panel border-white/10"
        />
      </div>

      <Select
        value={filters.sort}
        onValueChange={(v) => onChange({ ...filters, sort: v })}
      >
        <SelectTrigger className="glass-panel border-white/10">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="glass-panel-strong border-white/10">
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="delivery">Fastest Delivery</SelectItem>
        </SelectContent>
      </Select>

      <FilterGroup title="Brand">
        {brands.slice(0, 8).map((b) => (
          <FilterCheck
            key={b}
            label={b}
            checked={filters.brands.includes(b)}
            onChange={() => toggleArray("brands", b)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <FilterCheck
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onChange={() => toggleArray("categories", c)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Sales Channel">
        {channels.slice(0, 6).map((c) => (
          <FilterCheck
            key={c}
            label={c}
            checked={filters.channels.includes(c)}
            onChange={() => toggleArray("channels", c)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Country">
        {COUNTRIES.slice(0, 8).map((c) => (
          <FilterCheck
            key={c}
            label={c}
            checked={filters.countries.includes(c)}
            onChange={() => {
              toggleArray("countries", c);
              setCountryFilter(c);
            }}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
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
          Price Range: €{filters.priceRange[0]} – €{filters.priceRange[1]}
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
        label="Financing available"
        checked={filters.financeOnly}
        onChange={() => onChange({ ...filters, financeOnly: !filters.financeOnly })}
      />
      <FilterCheck
        label="Service coverage"
        checked={filters.serviceCoverage}
        onChange={() =>
          onChange({ ...filters, serviceCoverage: !filters.serviceCoverage })
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
      <Checkbox
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        className="border-white/20"
      />
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
  financeOnly: false,
  serviceCoverage: false,
  priceRange: [0, maxPrice],
  sort: "relevance",
});
