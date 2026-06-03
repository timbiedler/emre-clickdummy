"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Country, Industry, Language, UserRole, Vertical } from "@/data/types";
import { getHomeForRole } from "@/data/roles";

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
  role: UserRole;
  setRole: (r: UserRole) => void;
  industry: Industry;
  setIndustry: (i: Industry) => void;
  workspaceCountry: Country;
  setWorkspaceCountry: (c: Country) => void;
  companyType: string;
  setCompanyType: (t: string) => void;
  workspaceReady: boolean;
  enterWorkspace: (opts: {
    role: UserRole;
    industry: Industry;
    country: Country;
    companyType: string;
  }) => void;
  resetWorkspace: () => void;
  showRelevantFirst: boolean;
  setShowRelevantFirst: (v: boolean) => void;
  includeAllProducts: boolean;
  setIncludeAllProducts: (v: boolean) => void;
  currentUserName: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vertical, setVertical] = useState<Vertical>("medical");
  const [language, setLanguage] = useState<Language>("en");
  const [countryFilter, setCountryFilter] = useState<Country | "all">("all");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [adminVertical, setAdminVertical] = useState<Vertical | "combined">("combined");
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationProductId, setConsultationProductId] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole>("customer");
  const [industry, setIndustry] = useState<Industry>("Hospital / Clinic");
  const [workspaceCountry, setWorkspaceCountry] = useState<Country>("Germany");
  const [companyType, setCompanyType] = useState("Enterprise buyer");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [showRelevantFirst, setShowRelevantFirst] = useState(true);
  const [includeAllProducts, setIncludeAllProducts] = useState(true);
  const currentUserName = "Anna Weber";

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

  const enterWorkspace = useCallback(
    (opts: { role: UserRole; industry: Industry; country: Country; companyType: string }) => {
      setRole(opts.role);
      setIndustry(opts.industry);
      setWorkspaceCountry(opts.country);
      setCompanyType(opts.companyType);
      setWorkspaceReady(true);
      if (opts.role === "admin") setVertical("medical");
    },
    []
  );

  const resetWorkspace = useCallback(() => {
    setWorkspaceReady(false);
  }, []);

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
        role,
        setRole,
        industry,
        setIndustry,
        workspaceCountry,
        setWorkspaceCountry,
        companyType,
        setCompanyType,
        workspaceReady,
        enterWorkspace,
        resetWorkspace,
        showRelevantFirst,
        setShowRelevantFirst,
        includeAllProducts,
        setIncludeAllProducts,
        currentUserName,
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

export { getHomeForRole };
