"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CreditCard,
  MessageSquare,
  GitCompare,
  Wrench,
  Package,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { TranslationBadge } from "@/components/emre/translation-badge";
import { StatusBadge } from "@/components/emre/status-badge";
import { ProductCard } from "@/components/emre/product-card";
import { useApp } from "@/context/app-context";
import { getProducts } from "@/data";
import { suppliers } from "@/data/suppliers";
import { servicepoints } from "@/data/servicepoints";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/data/constants";
import type { Country } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import { getProductFinance } from "@/lib/product-finance";
import { getConsultationUseCases } from "@/lib/product-ai";
import { IndustrySelector } from "@/components/emre/industry-selector";
import { TranslationExamplesPanel } from "@/components/emre/translation-examples-panel";
import { getAiPromptsForIndustry } from "@/data/industry-content";
import { useUi } from "@/lib/ui-i18n";
import { useSourcing } from "@/context/sourcing-context";
import { useRfq } from "@/context/rfq-context";

const modes = [
  { id: "recommendation", label: "Product Recommendation", icon: Package },
  { id: "quote", label: "Get a Quote", icon: FileText },
  { id: "leasing", label: "Leasing / Financing", icon: CreditCard },
  { id: "consultation", label: "Sales Consultation", icon: MessageSquare },
  { id: "compare", label: "Compare Products", icon: GitCompare },
  { id: "service", label: "Service / Spare Parts", icon: Wrench },
  { id: "multisite", label: "Multi-location Plan", icon: Package },
] as const;

export default function AssistantPage() {
  const { vertical, openConsultation, role, industry, workspaceCountry, companyType } = useApp();
  const { t } = useUi();
  const { openCreateGapDrawer } = useSourcing();
  const { openCreateRfq } = useRfq();
  const industryPrompts = getAiPromptsForIndustry(industry);
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("recommendation");
  const [prompt, setPrompt] = useState(industryPrompts[0] ?? "");
  const [country, setCountry] = useState<Country>(workspaceCountry);
  const [result, setResult] = useState<ReturnType<typeof analyzeNeed> | null>(null);

  function analyzeNeed(text: string) {
    const products = getProducts(vertical).filter((p) =>
      text.toLowerCase().split(/\s+/).some((w) => w.length > 4 && p.category.toLowerCase().includes(w))
    );
    const exactMatch = products.length >= 2;
    const displayProducts = exactMatch ? products.slice(0, 4) : products.slice(0, 1);
    const matchedSuppliers = suppliers.filter((s) => s.vertical === vertical).slice(0, 2);
    const servicePartner = servicepoints.find((sp) => sp.vertical === vertical);
    const leadProduct = products[0];
    const finance = leadProduct ? getProductFinance(leadProduct) : null;

    return {
      interpreted: text,
      interpretedRole: t(`roles.${role}`),
      interpretedIndustry: industry,
      companyType,
      category: vertical === "medical" ? "PPE / Consumables" : "Cleaning Robots",
      products: displayProducts,
      exactMatch,
      suppliers: matchedSuppliers,
      servicePartner,
      budget: vertical === "medical" ? 125000 : 348000,
      delivery: vertical === "medical" ? "8–10 days" : "14–21 days",
      leasingOption: finance
        ? `${finance.termMonths}mo lease · ${formatCurrency(finance.leasingRateMonthly)}/mo`
        : "36mo lease available",
      monthlyCost: finance?.monthlyCostEstimate ?? 890,
      compliance:
        vertical === "medical"
          ? "CE/MDR documentation verified — public-sector procurement compatible"
          : "Service coverage confirmed in DE, AT, CH — fleet deployment ready",
      riskNotes:
        vertical === "medical"
          ? "Volume lead time critical — confirm cold-chain for diagnostics if applicable"
          : "Multi-country rollout requires unified service SLA and spare parts pool",
      translatedMessage: `[DE→EN verified] Competitive offer request with delivery confirmation to ${country}.`,
    };
  }

  const useCases = getConsultationUseCases(vertical);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="nav.aiAssistant"
        descriptionKey="translation.title"
        action={
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => openConsultation()}
          >
            <MessageSquare className="size-4" /> Book Consultation
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="surface-card rounded-xl p-5 space-y-4 border-blue-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-violet-600" />
                <h2 className="font-semibold">Describe Your Need</h2>
              </div>
              <IndustrySelector />
            </div>

            <div className="flex flex-wrap gap-2">
              {industryPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="text-xs rounded-md border border-slate-200 bg-slate-50 px-2 py-1 hover:bg-blue-50 hover:border-blue-200 text-left"
                >
                  {p.slice(0, 60)}…
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`surface-card rounded-lg p-3 text-left text-xs transition-all border ${
                    mode === m.id
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <m.icon className="size-4 mb-1 text-blue-600" />
                  {m.label}
                </button>
              ))}
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="surface-card border-slate-200 resize-none text-sm min-h-[120px]"
              placeholder="Describe products, volume, countries, budget, financing preference…"
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Target Country</Label>
                <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
                  <SelectTrigger className="surface-card border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="surface-card-elevated border-slate-200">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-cyan-600 to-violet-600 h-10"
                  onClick={() => setResult(analyzeNeed(prompt))}
                >
                  <Sparkles className="size-4" /> Run AI Analysis
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="surface-card rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">AI Result</h3>
                  <StatusBadge variant="success">Confidence 94%</StatusBadge>
                  <StatusBadge variant="violet">Mode: {mode.replace("_", " ")}</StatusBadge>
                </div>
                <p className="text-sm">{result.interpreted}</p>
                <TranslationBadge status="verified" showPanel sourceText={result.translatedMessage} />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Info label="Role" value={result.interpretedRole} />
                  <Info label="Industry" value={result.interpretedIndustry} />
                  <Info label="Company type" value={result.companyType} />
                  <Info label="Category" value={result.category} />
                  <Info label="Est. Budget" value={formatCurrency(result.budget)} />
                  <Info label="Leasing Option" value={result.leasingOption} />
                  <Info label="Monthly Cost" value={formatCurrency(result.monthlyCost)} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="surface-card rounded-lg p-3">
                    <span className="text-blue-600 font-medium">Compliance: </span>
                    {result.compliance}
                  </div>
                  <div className="surface-card rounded-lg p-3">
                    <span className="text-amber-600 font-medium">Risk Notes: </span>
                    {result.riskNotes}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Recommended Product Shortlist</p>
                {!result.exactMatch && (
                  <div className="surface-card rounded-xl p-4 mb-4 border border-amber-200 bg-amber-50">
                    <p className="text-sm text-amber-900 mb-2">{t("sourcing.noExactMatch")}</p>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        openCreateGapDrawer({
                          source: "ai_assistant",
                          requestedProduct: result.interpreted.slice(0, 120),
                          aiPrompt: prompt,
                          country,
                          expectedBudget: result.budget,
                          urgency: "high",
                        })
                      }
                    >
                      {t("sourcing.createGapRequest")}
                    </Button>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.products.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => {}} showActions={false} />
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="surface-card rounded-xl p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Suggested Suppliers
                  </p>
                  {result.suppliers.map((s) => (
                    <div key={s.id} className="text-sm surface-card rounded-lg p-2">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.country} · {s.responseTime}
                      </p>
                    </div>
                  ))}
                </div>
                {result.servicePartner && (
                  <div className="surface-card rounded-xl p-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Service Partner
                    </p>
                    <p className="font-medium text-sm">{result.servicePartner.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.servicePartner.type} · {result.servicePartner.responseTime}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    openCreateRfq({
                      source: "assistant",
                      mode: "rfq",
                      vertical,
                      prompt: result.interpreted,
                      category: result.category,
                      industry: result.interpretedIndustry,
                      deliveryCountry: country,
                      budget: result.budget,
                      quantity: result.products[0] ? 10 : 1,
                      productId: result.products[0]?.id,
                    })
                  }
                >
                  Create RFQ <ArrowRight className="size-3" />
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    openCreateRfq({
                      source: "assistant",
                      mode: "offer",
                      vertical,
                      prompt: result.interpreted,
                      category: result.category,
                      deliveryCountry: country,
                      budget: result.budget,
                      productId: result.products[0]?.id,
                    })
                  }
                >
                  Request Offer <ArrowRight className="size-3" />
                </Button>
                <Link href="/finance">
                  <Button variant="outline" className="gap-2">
                    Start Leasing Check <ArrowRight className="size-3" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => openConsultation()}
                >
                  Book Sales Consultation <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="surface-card rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium">Industry Use Cases</p>
            {useCases.map((uc) => (
              <button
                key={uc}
                type="button"
                onClick={() => setPrompt(uc)}
                className="w-full text-left text-xs surface-card rounded-lg px-3 py-2 hover:border-blue-300 transition-colors"
              >
                {uc}
              </button>
            ))}
          </div>
          <div className="surface-card rounded-xl p-4 space-y-2 text-sm">
            <p className="font-medium flex items-center gap-2">
              <CreditCard className="size-4 text-emerald-600" /> Finance Modes
            </p>
            {["Buy now", "Lease", "Rent-to-own", "Finetrading", "Service bundle"].map((m) => (
              <div key={m} className="flex justify-between text-xs">
                <span>{m}</span>
                <StatusBadge variant="success">EU</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TranslationExamplesPanel />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}
