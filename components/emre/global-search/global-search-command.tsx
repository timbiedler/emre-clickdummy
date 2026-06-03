"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Clock, Search, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalSearch } from "@/context/global-search-context";
import {
  groupSearchResults,
  SEARCH_SCOPE_KEYS,
  SUGGESTED_SEARCH_KEYS,
  type SearchResultGroup,
} from "@/lib/global-search";
import { useUi } from "@/lib/ui-i18n";
import { SearchResultRow } from "./search-result-row";

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

export function GlobalSearchCommand() {
  const { t } = useUi();
  const {
    open,
    setOpen,
    query,
    setQuery,
    scope,
    setScope,
    results,
    recentSearches,
    submitSearch,
    navigateToResult,
    setQuery: setQ,
  } = useGlobalSearch();

  const grouped = useMemo(
    () => (scope === "all" ? groupSearchResults(results) : null),
    [scope, results]
  );

  const showEmptyState = query.trim().length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden border-slate-200"
      >
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-slate-100">
          <DialogTitle className="sr-only">{t("globalSearch.title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("globalSearch.subtitle")}</DialogDescription>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
                placeholder={t("globalSearch.placeholder")}
                className="pl-9 h-10 bg-slate-50 border-slate-200"
              />
            </div>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as typeof scope)}
              className="h-10 rounded-lg border border-slate-200 px-2 text-sm bg-white max-w-[140px]"
              aria-label={t("globalSearch.scopeLabel")}
            >
              {SEARCH_SCOPE_KEYS.map((s) => (
                <option key={s} value={s}>
                  {t(`globalSearch.scope.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{t("globalSearch.hint")}</span>
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px]">
              {typeof navigator !== "undefined" && navigator.platform?.includes("Mac")
                ? "⌘"
                : "Ctrl"}
              +K
            </kbd>
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[min(60vh,480px)]">
          <div className="p-2">
            {showEmptyState && (
              <div className="space-y-4 px-2 py-2">
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
                      <Clock className="size-3.5" />
                      {t("globalSearch.recent")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQ(term)}
                          className="text-xs rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50 text-slate-700"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
                    <Sparkles className="size-3.5" />
                    {t("globalSearch.suggestedTitle")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SEARCH_KEYS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setQ(t(key))}
                        className="text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 hover:bg-blue-100"
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!showEmptyState && results.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">{t("globalSearch.noResults")}</p>
            )}

            {scope === "all" && grouped && !showEmptyState ? (
              Object.entries(grouped).map(([group, items]) =>
                items.length > 0 ? (
                  <div key={group} className="mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      {t(GROUP_LABEL_KEYS[group as SearchResultGroup])} ({items.length})
                    </p>
                    {items.slice(0, 5).map((r) => (
                      <SearchResultRow key={`${r.entityType}-${r.id}`} result={r} onSelect={navigateToResult} compact />
                    ))}
                  </div>
                ) : null
              )
            ) : (
              !showEmptyState &&
              results.map((r) => (
                <SearchResultRow key={`${r.entityType}-${r.id}`} result={r} onSelect={navigateToResult} />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>
            {results.length > 0
              ? t("globalSearch.resultCount").replace("{n}", String(results.length))
              : ""}
          </span>
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="text-blue-600 hover:underline font-medium"
          >
            {t("globalSearch.viewAll")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
