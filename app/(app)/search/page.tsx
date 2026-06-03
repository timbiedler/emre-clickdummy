"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { SearchResultRow } from "@/components/emre/global-search/search-result-row";
import { platformConnectors } from "@/data/connectors";
import { INDUSTRIES } from "@/data/industries";
import { COUNTRIES } from "@/data/constants";
import { useApp } from "@/context/app-context";
import { useGlobalSearch } from "@/context/global-search-context";
import {
  groupSearchResults,
  runGlobalSearch,
  SEARCH_SCOPE_KEYS,
  type SearchEntityType,
  type SearchResultGroup,
  type SearchScope,
} from "@/lib/global-search";
import { useUi } from "@/lib/ui-i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Country, Industry, Vertical } from "@/data/types";

const PAGE_SIZE = 12;

const GROUP_LABEL_KEYS: Record<SearchResultGroup, string> = {
  products: "globalSearch.group.products",
  rfqs: "globalSearch.group.rfqs",
  orders: "globalSearch.group.orders",
  finance: "globalSearch.group.finance",
  documents: "globalSearch.group.documents",
  suppliers: "globalSearch.group.suppliers",
  partners: "globalSearch.group.partners",
  leads: "globalSearch.group.leads",
  campaigns: "globalSearch.group.campaigns",
  magazine: "globalSearch.group.magazine",
  training: "globalSearch.group.training",
  network: "globalSearch.group.network",
  sourcing: "globalSearch.group.sourcing",
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, countryName } = useUi();
  const { role, language, vertical, industry, includeAllProducts } = useApp();
  const { navigateToResult, openSearch } = useGlobalSearch();
  const pathname = "/search";

  const initialQ = searchParams.get("q") ?? "";
  const initialScope = (searchParams.get("scope") as SearchScope) || "all";

  const [query, setQuery] = useState(initialQ);
  const [scope, setScope] = useState<SearchScope>(initialScope);
  const [typeFilter, setTypeFilter] = useState("all");
  const [verticalFilter, setVerticalFilter] = useState<Vertical | "all">("all");
  const [industryFilter, setIndustryFilter] = useState<Industry | "all">("all");
  const [countryFilter, setCountryFilter] = useState<Country | "all">("all");
  const [page, setPage] = useState(1);

  const connectorId = searchParams.get("connectorId");
  const selectedConnector = platformConnectors.find((c) => c.id === connectorId) ?? null;

  const rawResults = useMemo(
    () =>
      runGlobalSearch({
        query,
        scope,
        role,
        language,
        vertical,
        industry,
        pathname,
        includeAllProducts,
        limit: 200,
      }),
    [query, scope, role, language, vertical, industry, pathname, includeAllProducts]
  );

  const filtered = useMemo(() => {
    return rawResults.filter((r) => {
      if (typeFilter !== "all" && r.entityType !== typeFilter) return false;
      if (verticalFilter !== "all" && r.vertical && r.vertical !== verticalFilter && r.vertical !== "combined")
        return false;
      if (industryFilter !== "all" && r.industry && r.industry !== industryFilter) return false;
      if (countryFilter !== "all" && r.country && r.country !== countryFilter) return false;
      return true;
    });
  }, [rawResults, typeFilter, verticalFilter, industryFilter, countryFilter]);

  const grouped = useMemo(() => groupSearchResults(filtered), [filtered]);
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const entityTypes = useMemo(() => {
    const set = new Set<SearchEntityType>();
    rawResults.forEach((r) => set.add(r.entityType));
    return Array.from(set).sort();
  }, [rawResults]);

  return (
    <div className="space-y-6">
      <PageHeader titleKey="globalSearch.pageTitle" descriptionKey="globalSearch.pageSubtitle" />

      <div className="surface-card rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("globalSearch.placeholder")}
              className="pl-9 h-10"
            />
          </div>
          <select
            value={scope}
            onChange={(e) => {
              setScope(e.target.value as SearchScope);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            aria-label={t("globalSearch.scopeLabel")}
          >
            {SEARCH_SCOPE_KEYS.map((s) => (
              <option key={s} value={s}>
                {t(`globalSearch.scope.${s}`)}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" className="h-10" onClick={() => openSearch({ query, scope })}>
            {t("globalSearch.openCommand")}
            <kbd className="ml-2 text-[10px] opacity-60">⌘K</kbd>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-slate-500">{t("globalSearch.filters")}</span>
          <select
            className="h-8 rounded-lg border border-slate-200 px-2 text-xs"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">{t("globalSearch.allTypes")}</option>
            {entityTypes.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
          <select
            className="h-8 rounded-lg border border-slate-200 px-2 text-xs"
            value={verticalFilter}
            onChange={(e) => {
              setVerticalFilter(e.target.value as Vertical | "all");
              setPage(1);
            }}
          >
            <option value="all">{t("globalSearch.allVerticals")}</option>
            <option value="medical">{t("vertical.medical")}</option>
            <option value="robotics">{t("vertical.robotics")}</option>
          </select>
          <select
            className="h-8 rounded-lg border border-slate-200 px-2 text-xs max-w-[200px]"
            value={industryFilter}
            onChange={(e) => {
              setIndustryFilter(e.target.value as Industry | "all");
              setPage(1);
            }}
          >
            <option value="all">{t("globalSearch.allIndustries")}</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          <select
            className="h-8 rounded-lg border border-slate-200 px-2 text-xs max-w-[160px]"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value as Country | "all");
              setPage(1);
            }}
          >
            <option value="all">{t("globalSearch.allCountries")}</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {countryName(c)}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 ml-auto">
            {t("globalSearch.resultCount").replace("{n}", String(filtered.length))}
          </span>
        </div>
      </div>

      {scope === "all" && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(grouped).map(([group, items]) =>
            items.length > 0 ? (
              <div key={group} className="surface-card rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">
                  {t(GROUP_LABEL_KEYS[group as SearchResultGroup])}
                </p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{items.length}</p>
              </div>
            ) : null
          )}
        </div>
      )}

      <div className="surface-card rounded-xl divide-y divide-slate-100">
        {paginated.length === 0 ? (
          <p className="text-sm text-slate-500 p-8 text-center">{t("globalSearch.noResults")}</p>
        ) : scope === "all" ? (
          Object.entries(grouped).map(([group, items]) => {
            const shown = items.filter((i) => paginated.some((p) => p.id === i.id && p.entityType === i.entityType));
            if (shown.length === 0) return null;
            return (
              <div key={group} className="p-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
                  {t(GROUP_LABEL_KEYS[group as SearchResultGroup])}
                </p>
                {shown.map((r) => (
                  <SearchResultRow key={`${r.entityType}-${r.id}`} result={r} onSelect={navigateToResult} />
                ))}
              </div>
            );
          })
        ) : (
          paginated.map((r) => (
            <SearchResultRow key={`${r.entityType}-${r.id}`} result={r} onSelect={navigateToResult} />
          ))
        )}
      </div>

      {filtered.length > paginated.length && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load more
          </Button>
        </div>
      )}

      <Sheet
        open={!!selectedConnector}
        onOpenChange={(open) => {
          if (!open) router.push("/search");
        }}
      >
        <SheetContent className="surface-card-elevated sm:max-w-md">
          {selectedConnector && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedConnector.name}</SheetTitle>
              </SheetHeader>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">{t("globalSearch.connectorStatus")}</dt>
                  <dd className="font-medium capitalize">{selectedConnector.status}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-medium uppercase">{selectedConnector.type}</dd>
                </div>
                <p className="text-slate-600">{selectedConnector.description}</p>
                {selectedConnector.eventsPerDay != null && (
                  <div>
                    <dt className="text-slate-500">{t("globalSearch.connectorEvents")}</dt>
                    <dd className="font-medium">{selectedConnector.eventsPerDay}</dd>
                  </div>
                )}
              </dl>
              <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700" type="button">
                {t("globalSearch.action.configure")}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
