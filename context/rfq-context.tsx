"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { rfqs as staticRfqs } from "@/data/rfqs";
import { getAllProducts } from "@/data";
import { growthLeads } from "@/data/growth";
import { localize } from "@/data/generators";
import type {
  Country,
  Industry,
  Language,
  RFQ,
  RfqCreatedFrom,
  RfqStatusTimelineEntry,
  Vertical,
} from "@/data/types";
import type { GrowthLead } from "@/data/growth-types";
import { mockTranslateMessage, suggestRfqMessage } from "@/lib/rfq-matching";
import { t as localizedText } from "@/lib/i18n";

export type CreateRfqSource = RfqCreatedFrom;

export interface CreateRfqPrefill {
  source: CreateRfqSource;
  mode?: "rfq" | "offer";
  productId?: string;
  productName?: string;
  category?: string;
  supplierId?: string;
  vertical?: Vertical;
  quantity?: number;
  budget?: number;
  budgetRange?: string;
  deliveryCountry?: Country;
  deliveryDate?: string;
  industry?: Industry | string;
  useCase?: string;
  prompt?: string;
  leadId?: string;
  lead?: GrowthLead;
  companyName?: string;
  bundleName?: string;
  sourcingNotes?: string;
  financeInterest?: boolean;
  leasingInterest?: boolean;
  relatedProductIds?: string[];
  requestAlternatives?: boolean;
}

export interface RfqDraft {
  source: CreateRfqSource;
  mode: "rfq" | "offer";
  vertical: Vertical;
  productId: string;
  productName: string;
  category: string;
  supplierId: string;
  quantity: number;
  deliveryCountry: Country;
  deliveryDate: string;
  industry: string;
  useCase: string;
  budget: number;
  budgetRange: string;
  financeInterest: boolean;
  leasingInterest: boolean;
  bundleName: string;
  relatedProductIds: string[];
  requestAlternatives: boolean;
  selectedSupplierIds: string[];
  buyerMessage: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  translatedMessage: string;
  complianceNotes: string;
  responseDeadline: string;
  companyName: string;
  sourcingNotes: string;
  leadId: string;
}

export type RfqWizardStep = 1 | 2 | 3 | 4 | 5 | "confirmation";

const defaultDraft = (vertical: Vertical): RfqDraft => ({
  source: "generic",
  mode: "rfq",
  vertical,
  productId: "",
  productName: "",
  category: "",
  supplierId: "",
  quantity: 1,
  deliveryCountry: "Germany",
  deliveryDate: "",
  industry: "",
  useCase: "",
  budget: 0,
  budgetRange: "",
  financeInterest: false,
  leasingInterest: false,
  bundleName: "",
  relatedProductIds: [],
  requestAlternatives: false,
  selectedSupplierIds: [],
  buyerMessage: "",
  sourceLanguage: "de",
  targetLanguage: "en",
  translatedMessage: "",
  complianceNotes: "",
  responseDeadline: "",
  companyName: "",
  sourcingNotes: "",
  leadId: "",
});

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function applyPrefill(draft: RfqDraft, prefill: CreateRfqPrefill, vertical: Vertical): RfqDraft {
  const next = { ...draft, source: prefill.source, mode: prefill.mode ?? draft.mode, vertical: prefill.vertical ?? vertical };

  if (prefill.productId) {
    const product = getAllProducts().find((p) => p.id === prefill.productId);
    if (product) {
      next.productId = product.id;
      next.productName = localizedText(product.name, "en");
      next.category = product.category;
      next.supplierId = product.supplierId;
      next.vertical = product.vertical;
      next.quantity = prefill.quantity ?? 1;
      next.deliveryCountry = prefill.deliveryCountry ?? product.primaryCountry;
      next.budget = prefill.budget ?? product.price * next.quantity;
      next.budgetRange = prefill.budgetRange ?? `${Math.round(next.budget * 0.9)}–${Math.round(next.budget * 1.1)} EUR`;
      next.financeInterest = product.financeAvailable;
      next.leasingInterest = product.financeAvailable;
      next.relatedProductIds = product.relatedIds.slice(0, 3);
    }
  }

  if (prefill.productName) next.productName = prefill.productName;
  if (prefill.category) next.category = prefill.category;
  if (prefill.supplierId) next.supplierId = prefill.supplierId;
  if (prefill.quantity) next.quantity = prefill.quantity;
  if (prefill.budget) next.budget = prefill.budget;
  if (prefill.budgetRange) next.budgetRange = prefill.budgetRange;
  if (prefill.deliveryCountry) next.deliveryCountry = prefill.deliveryCountry;
  if (prefill.deliveryDate) next.deliveryDate = prefill.deliveryDate;
  if (prefill.industry) next.industry = prefill.industry;
  if (prefill.useCase) next.useCase = prefill.useCase;
  if (prefill.bundleName) next.bundleName = prefill.bundleName;
  if (prefill.sourcingNotes) next.sourcingNotes = prefill.sourcingNotes;
  if (prefill.companyName) next.companyName = prefill.companyName;
  if (prefill.financeInterest !== undefined) next.financeInterest = prefill.financeInterest;
  if (prefill.leasingInterest !== undefined) next.leasingInterest = prefill.leasingInterest;
  if (prefill.relatedProductIds) next.relatedProductIds = prefill.relatedProductIds;
  if (prefill.requestAlternatives !== undefined) next.requestAlternatives = prefill.requestAlternatives;
  if (prefill.leadId) next.leadId = prefill.leadId;

  const lead = prefill.lead ?? (prefill.leadId ? growthLeads.find((l) => l.id === prefill.leadId) : undefined);
  if (lead) {
    next.leadId = lead.id;
    next.companyName = lead.company;
    next.industry = lead.industry;
    next.deliveryCountry = lead.country;
    next.vertical = lead.vertical;
    next.bundleName = lead.productFit[0] ?? next.bundleName;
    next.financeInterest = lead.financePotential !== "low";
    next.leasingInterest = lead.financePotential === "high";
    next.useCase = lead.signal;
  }

  if (prefill.prompt) {
    next.useCase = prefill.prompt;
    if (!next.category) next.category = prefill.category ?? (vertical === "medical" ? "PPE / Consumables" : "Cleaning Robots");
    if (!next.budget && prefill.budget) next.budget = prefill.budget;
  }

  if (!next.deliveryDate) next.deliveryDate = addDays(21);
  if (!next.responseDeadline) next.responseDeadline = addDays(14);
  if (!next.budgetRange && next.budget) {
    next.budgetRange = `${Math.round(next.budget * 0.85)}–${Math.round(next.budget * 1.15)} EUR`;
  }

  next.buyerMessage = suggestRfqMessage({
    productName: next.productName || undefined,
    quantity: next.quantity,
    deliveryCountry: next.deliveryCountry,
    category: next.category || undefined,
    financeInterest: next.financeInterest,
  });

  next.translatedMessage = mockTranslateMessage(next.buyerMessage, next.sourceLanguage, next.targetLanguage);

  return next;
}

interface RfqContextValue {
  wizardOpen: boolean;
  wizardStep: RfqWizardStep;
  draft: RfqDraft;
  createdRfqs: RFQ[];
  lastCreatedRfq: RFQ | null;
  allRfqs: RFQ[];
  openCreateRfq: (prefill?: CreateRfqPrefill) => void;
  closeCreateRfq: () => void;
  setWizardStep: (step: RfqWizardStep) => void;
  updateDraft: (patch: Partial<RfqDraft>) => void;
  createRfq: (opts?: { asDraft?: boolean }) => RFQ;
  viewCreatedRfq: (rfq: RFQ) => void;
}

const RfqContext = createContext<RfqContextValue | null>(null);

let rfqCounter = 1001;

export function RfqProvider({ children }: { children: ReactNode }) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<RfqWizardStep>(1);
  const [draft, setDraft] = useState<RfqDraft>(() => defaultDraft("medical"));
  const [createdRfqs, setCreatedRfqs] = useState<RFQ[]>([]);
  const [lastCreatedRfq, setLastCreatedRfq] = useState<RFQ | null>(null);

  const allRfqs = useMemo(() => [...createdRfqs, ...staticRfqs], [createdRfqs]);

  const updateDraft = useCallback((patch: Partial<RfqDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (patch.buyerMessage !== undefined || patch.sourceLanguage !== undefined || patch.targetLanguage !== undefined) {
        next.translatedMessage = mockTranslateMessage(
          patch.buyerMessage ?? prev.buyerMessage,
          patch.sourceLanguage ?? prev.sourceLanguage,
          patch.targetLanguage ?? prev.targetLanguage
        );
      }
      return next;
    });
  }, []);

  const openCreateRfq = useCallback((prefill?: CreateRfqPrefill) => {
    const base = defaultDraft(prefill?.vertical ?? "medical");
    const filled = prefill ? applyPrefill(base, prefill, prefill.vertical ?? "medical") : base;
    setDraft(filled);
    setWizardStep(1);
    setLastCreatedRfq(null);
    setWizardOpen(true);
  }, []);

  const closeCreateRfq = useCallback(() => {
    setWizardOpen(false);
    setWizardStep(1);
  }, []);

  const createRfq = useCallback(
    (opts?: { asDraft?: boolean }) => {
      const rfqNumber = `RFQ-2026-${String(rfqCounter++).padStart(4, "0")}`;
      const now = new Date().toISOString().slice(0, 10);
      const titleText =
        draft.productName ||
        draft.bundleName ||
        draft.category ||
        (draft.mode === "offer" ? "Offer request" : "Procurement request");

      const timeline: RfqStatusTimelineEntry[] = [
        { status: "created", timestamp: now, note: `Created from ${draft.source}` },
        {
          status: opts?.asDraft ? "draft" : "sent",
          timestamp: now,
          note: opts?.asDraft ? "Saved as draft" : "Sent to selected suppliers",
        },
      ];

      const rfq: RFQ = {
        id: rfqNumber.toLowerCase(),
        rfqNumber,
        vertical: draft.vertical,
        title: localize(`${titleText} · ${draft.quantity.toLocaleString()} units`),
        buyerId: "buy-01",
        status: opts?.asDraft ? "draft" : "active",
        quantity: draft.quantity,
        budget: draft.budget,
        deliveryCountry: draft.deliveryCountry,
        createdAt: now,
        deadline: draft.responseDeadline || addDays(14),
        matchedSuppliers: draft.selectedSupplierIds.length,
        offersCount: 0,
        translationStatus: draft.translatedMessage.includes("→") ? "auto" : "verified",
        message: localize(draft.buyerMessage),
        productId: draft.productId || undefined,
        productName: draft.productName || undefined,
        category: draft.category || undefined,
        industry: draft.industry || undefined,
        useCase: draft.useCase || undefined,
        financeInterest: draft.financeInterest,
        leasingInterest: draft.leasingInterest,
        selectedSupplierIds: [...draft.selectedSupplierIds],
        translatedMessage: draft.translatedMessage,
        sourceLanguage: draft.sourceLanguage,
        targetLanguage: draft.targetLanguage,
        buyerMessage: draft.buyerMessage,
        responseDeadline: draft.responseDeadline,
        createdFrom: draft.source,
        budgetRange: draft.budgetRange,
        deliveryDate: draft.deliveryDate,
        bundleName: draft.bundleName || undefined,
        companyName: draft.companyName || undefined,
        sourcingNotes: draft.sourcingNotes || undefined,
        statusTimeline: timeline,
        leadId: draft.leadId || undefined,
        requestAlternatives: draft.requestAlternatives,
        relatedProductIds: draft.relatedProductIds,
        complianceNotes: draft.complianceNotes || undefined,
      };

      setCreatedRfqs((prev) => [rfq, ...prev]);
      setLastCreatedRfq(rfq);
      setWizardStep("confirmation");
      return rfq;
    },
    [draft]
  );

  const viewCreatedRfq = useCallback((rfq: RFQ) => {
    setLastCreatedRfq(rfq);
  }, []);

  const value = useMemo(
    () => ({
      wizardOpen,
      wizardStep,
      draft,
      createdRfqs,
      lastCreatedRfq,
      allRfqs,
      openCreateRfq,
      closeCreateRfq,
      setWizardStep,
      updateDraft,
      createRfq,
      viewCreatedRfq,
    }),
    [
      wizardOpen,
      wizardStep,
      draft,
      createdRfqs,
      lastCreatedRfq,
      allRfqs,
      openCreateRfq,
      closeCreateRfq,
      updateDraft,
      createRfq,
      viewCreatedRfq,
    ]
  );

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq() {
  const ctx = useContext(RfqContext);
  if (!ctx) throw new Error("useRfq must be used within RfqProvider");
  return ctx;
}
