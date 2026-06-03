"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import {
  addRecentSearch,
  buildSearchPageUrl,
  getRecentSearches,
  runGlobalSearch,
  type GlobalSearchResult,
  type SearchScope,
} from "@/lib/global-search";

interface GlobalSearchContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  scope: SearchScope;
  setScope: (s: SearchScope) => void;
  results: GlobalSearchResult[];
  recentSearches: string[];
  openSearch: (opts?: { query?: string; scope?: SearchScope }) => void;
  submitSearch: (q?: string) => void;
  navigateToResult: (result: GlobalSearchResult) => void;
  refreshRecent: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, language, vertical, industry, includeAllProducts } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    typeof window !== "undefined" ? getRecentSearches() : []
  );

  const refreshRecent = useCallback(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(
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
        limit: open ? 24 : 60,
      }),
    [query, scope, role, language, vertical, industry, pathname, includeAllProducts, open]
  );

  const openSearch = useCallback(
    (opts?: { query?: string; scope?: SearchScope }) => {
      if (opts?.query !== undefined) setQuery(opts.query);
      if (opts?.scope) setScope(opts.scope);
      setRecentSearches(getRecentSearches());
      setOpen(true);
    },
    []
  );

  const submitSearch = useCallback(
    (q?: string) => {
      const term = (q ?? query).trim();
      if (term) addRecentSearch(term);
      refreshRecent();
      setOpen(false);
      router.push(
        buildSearchPageUrl({
          q: term || undefined,
          scope: scope === "current_view" ? "all" : scope,
        })
      );
    },
    [query, scope, router, refreshRecent]
  );

  const navigateToResult = useCallback(
    (result: GlobalSearchResult) => {
      if (query.trim()) addRecentSearch(query.trim());
      refreshRecent();
      setOpen(false);
      router.push(result.href);
    },
    [query, router, refreshRecent]
  );

  return (
    <GlobalSearchContext.Provider
      value={{
        open,
        setOpen,
        query,
        setQuery,
        scope,
        setScope,
        results,
        recentSearches,
        openSearch,
        submitSearch,
        navigateToResult,
        refreshRecent,
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  return ctx;
}
