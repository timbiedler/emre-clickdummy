"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Country, Language, Vertical } from "@/data/types";

interface AppContextValue {
  vertical: Vertical;
  setVertical: (v: Vertical) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  countryFilter: Country | "all";
  setCountryFilter: (c: Country | "all") => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  adminVertical: Vertical | "combined";
  setAdminVertical: (v: Vertical | "combined") => void;
  consultationOpen: boolean;
  openConsultation: (productId?: string) => void;
  closeConsultation: () => void;
  consultationProductId: string | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vertical, setVertical] = useState<Vertical>("medical");
  const [language, setLanguage] = useState<Language>("en");
  const [countryFilter, setCountryFilter] = useState<Country | "all">("all");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [adminVertical, setAdminVertical] = useState<Vertical | "combined">(
    "combined"
  );
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationProductId, setConsultationProductId] = useState<string | null>(
    null
  );

  const openConsultation = useCallback((productId?: string) => {
    setConsultationProductId(productId ?? null);
    setConsultationOpen(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setConsultationOpen(false);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 4)
    );
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <AppContext.Provider
      value={{
        vertical,
        setVertical,
        language,
        setLanguage,
        countryFilter,
        setCountryFilter,
        compareList,
        toggleCompare,
        clearCompare,
        adminVertical,
        setAdminVertical,
        consultationOpen,
        openConsultation,
        closeConsultation,
        consultationProductId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
