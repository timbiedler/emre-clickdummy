"use client";

import {
  Shield,
  ShoppingCart,
  Truck,
  Store,
  Handshake,
  Wrench,
  CreditCard,
  Megaphone,
  Warehouse,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/context/app-context";
import { PRODUCT_NAME_LINE1, PRODUCT_NAME_LINE2, DEMO_BASE_URL } from "@/data/constants";
import { EU_REGIONS, type EuRegionKey } from "@/data/eu-regions";
import { INDUSTRIES } from "@/data/industries";
import { getHomeForRole } from "@/data/roles";
import type { Country, Industry, UserRole } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/emre/language-switcher";
import { useUi } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

const roleCards: {
  id: UserRole;
  icon: typeof Shield;
}[] = [
  { id: "admin", icon: Shield },
  { id: "customer", icon: ShoppingCart },
  { id: "supplier", icon: Truck },
  { id: "dealer", icon: Store },
  { id: "sales_partner", icon: Handshake },
  { id: "service_partner", icon: Wrench },
  { id: "finance_partner", icon: CreditCard },
  { id: "agency", icon: Megaphone },
  { id: "logistics", icon: Warehouse },
];

const companyTypes: Record<UserRole, string[]> = {
  admin: ["Platform operator", "Regional operator"],
  customer: ["Enterprise buyer", "Public sector buyer", "Group procurement"],
  supplier: ["Manufacturer", "Distributor", "Importer"],
  dealer: ["Authorized dealer", "Regional reseller"],
  sales_partner: ["Regional partner", "Vertical specialist", "Showroom partner"],
  service_partner: ["Service company", "Installation partner"],
  finance_partner: ["Leasing company", "Financing bank"],
  agency: ["Marketing agency", "Campaign partner"],
  logistics: ["3PL provider", "Fulfillment center"],
};

const regionKeys = Object.keys(EU_REGIONS) as EuRegionKey[];

export default function EnterPage() {
  const { enterWorkspace, workspaceReady, role } = useApp();
  const { t, countryName } = useUi();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [industry, setIndustry] = useState<Industry>("Hospital / Clinic");
  const [country, setCountry] = useState<Country>("Germany");
  const [companyType, setCompanyType] = useState("Enterprise buyer");

  useEffect(() => {
    if (workspaceReady) {
      router.replace(getHomeForRole(role));
    }
  }, [workspaceReady, role, router]);

  const handleContinue = () => {
    enterWorkspace({ role: selectedRole, industry, country, companyType });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="leading-tight">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">
              {PRODUCT_NAME_LINE1}
            </p>
            <p className="text-xl font-semibold text-slate-900">{PRODUCT_NAME_LINE2}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{t("enter.title")}</h1>
            <p className="text-sm text-slate-500 mt-2">{t("enter.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roleCards.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedRole(id);
                  setCompanyType(companyTypes[id][0]);
                }}
                className={cn(
                  "text-left rounded-xl border p-4 transition-all",
                  selectedRole === id
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 mb-3",
                    selectedRole === id ? "text-blue-600" : "text-slate-400"
                  )}
                />
                <p className="text-sm font-semibold text-slate-900">{t(`roles.${id}`)}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t(`rolesDesc.${id}`)}
                </p>
              </button>
            ))}
          </div>

          <div className="surface-card p-6 grid sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">{t("enter.industryContext")}</Label>
              <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">{t("enter.countryRegion")}</Label>
              <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {regionKeys.map((regionKey) => (
                    <SelectGroup key={regionKey}>
                      <SelectLabel>{t(`regions.${regionKey}`)}</SelectLabel>
                      {EU_REGIONS[regionKey].map((c) => (
                        <SelectItem key={c} value={c}>
                          {countryName(c)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">{t("enter.companyType")}</Label>
              <Select value={companyType} onValueChange={setCompanyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companyTypes[selectedRole].map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700 h-11 px-6"
            onClick={handleContinue}
          >
            {t("enter.enterWorkspace")} <ArrowRight className="size-4" />
          </Button>

          <p className="text-xs text-slate-400">
            Demo:{" "}
            <a
              href={`${DEMO_BASE_URL}/enter`}
              className="underline hover:text-slate-600"
            >
              distribution-engine-demo.vercel.app
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
