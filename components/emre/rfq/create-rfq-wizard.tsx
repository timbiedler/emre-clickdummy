"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/emre/status-badge";
import { TranslationBadge } from "@/components/emre/translation-badge";
import { useRfq, type RfqWizardStep } from "@/context/rfq-context";
import { useApp } from "@/context/app-context";
import { COUNTRIES, LANGUAGES } from "@/data/constants";
import { getAllProducts } from "@/data";
import { matchSuppliersForRfq, suggestRfqMessage } from "@/lib/rfq-matching";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Country, Language } from "@/data/types";

const STEPS = [1, 2, 3, 4, 5] as const;

export function CreateRfqWizard() {
  const router = useRouter();
  const { t, countryName } = useUi();
  const { industry, vertical } = useApp();
  const {
    wizardOpen,
    wizardStep,
    draft,
    lastCreatedRfq,
    openCreateRfq,
    closeCreateRfq,
    setWizardStep,
    updateDraft,
    createRfq,
  } = useRfq();

  const products = getAllProducts();
  const relatedProducts = products.filter((p) => draft.relatedProductIds.includes(p.id));

  const matchedSuppliers = useMemo(
    () =>
      matchSuppliersForRfq({
        vertical: draft.vertical,
        category: draft.category,
        deliveryCountry: draft.deliveryCountry,
        financeInterest: draft.financeInterest,
        leasingInterest: draft.leasingInterest,
        productSupplierId: draft.supplierId,
      }),
    [draft.vertical, draft.category, draft.deliveryCountry, draft.financeInterest, draft.leasingInterest, draft.supplierId]
  );

  const toggleSupplier = (id: string) => {
    const ids = draft.selectedSupplierIds.includes(id)
      ? draft.selectedSupplierIds.filter((x) => x !== id)
      : [...draft.selectedSupplierIds, id];
    updateDraft({ selectedSupplierIds: ids });
  };

  const applyAiMessage = () => {
    const msg = suggestRfqMessage({
      productName: draft.productName || undefined,
      quantity: draft.quantity,
      deliveryCountry: draft.deliveryCountry,
      category: draft.category || undefined,
      financeInterest: draft.financeInterest,
    });
    updateDraft({ buyerMessage: msg });
  };

  const stepIndex = wizardStep === "confirmation" ? 6 : wizardStep;

  const goNext = () => {
    if (wizardStep === 2 && draft.selectedSupplierIds.length === 0) {
      updateDraft({ selectedSupplierIds: matchedSuppliers.slice(0, 3).map((s) => s.id) });
    }
    if (wizardStep !== "confirmation" && wizardStep < 5) {
      setWizardStep((wizardStep + 1) as RfqWizardStep);
    }
  };

  const canNext =
    wizardStep === 1
      ? draft.quantity > 0 && draft.deliveryCountry
      : wizardStep === 3
        ? draft.selectedSupplierIds.length > 0
        : wizardStep === 4
          ? draft.buyerMessage.trim().length > 0
          : true;

  return (
    <Sheet open={wizardOpen} onOpenChange={(v) => !v && closeCreateRfq()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-2xl p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-5">
            <SheetHeader className="text-left">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                DISTRIBUTION ENGINE
              </p>
              <SheetTitle>{t("rfq.wizard.title")}</SheetTitle>
              {wizardStep !== "confirmation" && (
                <p className="text-sm text-muted-foreground">{t("rfq.wizard.subtitle")}</p>
              )}
            </SheetHeader>

            {wizardStep !== "confirmation" && (
              <div className="flex gap-1 flex-wrap">
                {STEPS.map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-medium border",
                      stepIndex === s
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : stepIndex > s
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-white border-slate-200 text-slate-400"
                    )}
                  >
                    {s}. {t(`rfq.wizard.step${s}`)}
                  </div>
                ))}
              </div>
            )}

            {wizardStep === 1 && (
              <div className="space-y-4">
                <Field label={t("rfq.wizard.category")}>
                  <Input
                    value={draft.category}
                    onChange={(e) => updateDraft({ category: e.target.value })}
                    placeholder={t("rfq.wizard.categoryPlaceholder")}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("rfq.wizard.quantity")}>
                    <Input
                      type="number"
                      min={1}
                      value={draft.quantity}
                      onChange={(e) => updateDraft({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                    />
                  </Field>
                  <Field label={t("rfq.wizard.deliveryCountry")}>
                    <Select
                      value={draft.deliveryCountry}
                      onValueChange={(v) => updateDraft({ deliveryCountry: v as Country })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{countryName(c)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("rfq.wizard.deliveryDate")}>
                    <Input
                      type="date"
                      value={draft.deliveryDate}
                      onChange={(e) => updateDraft({ deliveryDate: e.target.value })}
                    />
                  </Field>
                  <Field label={t("rfq.wizard.responseDeadline")}>
                    <Input
                      type="date"
                      value={draft.responseDeadline}
                      onChange={(e) => updateDraft({ responseDeadline: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={t("rfq.wizard.industry")}>
                  <Input
                    value={draft.industry || industry}
                    onChange={(e) => updateDraft({ industry: e.target.value })}
                  />
                </Field>
                <Field label={t("rfq.wizard.useCase")}>
                  <Textarea
                    value={draft.useCase}
                    onChange={(e) => updateDraft({ useCase: e.target.value })}
                    rows={2}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("rfq.wizard.budget")}>
                    <Input
                      type="number"
                      value={draft.budget || ""}
                      onChange={(e) => updateDraft({ budget: Number(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field label={t("rfq.wizard.budgetRange")}>
                    <Input
                      value={draft.budgetRange}
                      onChange={(e) => updateDraft({ budgetRange: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={draft.financeInterest}
                      onCheckedChange={(v) => updateDraft({ financeInterest: Boolean(v) })}
                    />
                    {t("rfq.wizard.financeInterest")}
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={draft.leasingInterest}
                      onCheckedChange={(v) => updateDraft({ leasingInterest: Boolean(v) })}
                    />
                    {t("rfq.wizard.leasingInterest")}
                  </label>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                {draft.productId && (
                  <div className="surface-card rounded-lg p-4 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                      <Package className="size-3" /> {t("rfq.wizard.selectedProduct")}
                    </p>
                    <p className="font-medium">{draft.productName}</p>
                    <p className="text-xs text-muted-foreground">{draft.category}</p>
                  </div>
                )}
                {draft.bundleName && (
                  <div className="surface-card rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">{t("rfq.wizard.bundle")}</p>
                    <p className="font-medium">{draft.bundleName}</p>
                  </div>
                )}
                {!draft.productId && !draft.bundleName && (
                  <Field label={t("rfq.wizard.productName")}>
                    <Input
                      value={draft.productName}
                      onChange={(e) => updateDraft({ productName: e.target.value })}
                    />
                  </Field>
                )}
                {relatedProducts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t("rfq.wizard.relatedProducts")}</p>
                    {relatedProducts.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm surface-card rounded-lg p-2 cursor-pointer">
                        <Checkbox
                          checked={draft.relatedProductIds.includes(p.id)}
                          onCheckedChange={(v) => {
                            const ids = v
                              ? [...draft.relatedProductIds, p.id]
                              : draft.relatedProductIds.filter((x) => x !== p.id);
                            updateDraft({ relatedProductIds: ids });
                          }}
                        />
                        {p.name.en}
                      </label>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={draft.requestAlternatives}
                    onCheckedChange={(v) => updateDraft({ requestAlternatives: Boolean(v) })}
                  />
                  {t("rfq.wizard.requestAlternatives")}
                </label>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t("rfq.wizard.matchingHint")}</p>
                {matchedSuppliers.map((s) => {
                  const selected = draft.selectedSupplierIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSupplier(s.id)}
                      className={cn(
                        "w-full text-left surface-card rounded-lg p-4 space-y-2 transition-colors",
                        selected ? "ring-2 ring-blue-300 border-blue-200" : "hover:border-blue-200"
                      )}
                    >
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{countryName(s.country)} · {s.responseTime}</p>
                        </div>
                        <StatusBadge variant={selected ? "success" : "info"}>{s.score}% match</StatusBadge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <StatusBadge variant="default">{s.availability.replace("_", " ")}</StatusBadge>
                        <StatusBadge variant="default">{s.deliveryEstimateDays}d delivery</StatusBadge>
                        <StatusBadge variant="default">{s.documentReadiness}% docs</StatusBadge>
                        {s.financeReady && <StatusBadge variant="success"><CreditCard className="size-3 mr-0.5" />Finance</StatusBadge>}
                        {s.leasingReady && <StatusBadge variant="success">Leasing</StatusBadge>}
                        <TranslationBadge status={s.translationStatus} />
                      </div>
                    </button>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  {draft.selectedSupplierIds.length} {t("rfq.wizard.suppliersSelected")}
                </p>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4">
                <Field label={t("rfq.wizard.buyerMessage")}>
                  <Textarea
                    value={draft.buyerMessage}
                    onChange={(e) => updateDraft({ buyerMessage: e.target.value })}
                    rows={4}
                  />
                </Field>
                <Button size="sm" variant="outline" className="gap-1" onClick={applyAiMessage}>
                  <Sparkles className="size-3" /> {t("rfq.wizard.aiSuggestMessage")}
                </Button>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("rfq.wizard.sourceLanguage")}>
                    <Select
                      value={draft.sourceLanguage}
                      onValueChange={(v) => updateDraft({ sourceLanguage: v as Language })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.slice(0, 8).map((l) => (
                          <SelectItem key={l.code} value={l.code}>{l.nativeLabel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("rfq.wizard.targetLanguage")}>
                    <Select
                      value={draft.targetLanguage}
                      onValueChange={(v) => updateDraft({ targetLanguage: v as Language })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.slice(0, 8).map((l) => (
                          <SelectItem key={l.code} value={l.code}>{l.nativeLabel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="surface-card rounded-lg p-4 space-y-2">
                  <p className="text-xs font-medium text-blue-600 uppercase flex items-center gap-1">
                    <Globe className="size-3" /> {t("rfq.wizard.translatedPreview")}
                  </p>
                  <p className="text-sm">{draft.translatedMessage}</p>
                </div>
                <Field label={t("rfq.wizard.complianceNotes")}>
                  <Textarea
                    value={draft.complianceNotes}
                    onChange={(e) => updateDraft({ complianceNotes: e.target.value })}
                    rows={2}
                    placeholder={t("rfq.wizard.compliancePlaceholder")}
                  />
                </Field>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="space-y-4 text-sm">
                <SummaryRow icon={FileText} label={t("rfq.wizard.summaryProduct")} value={draft.productName || draft.category || "—"} />
                <SummaryRow icon={Package} label={t("rfq.wizard.quantity")} value={draft.quantity.toLocaleString()} />
                <SummaryRow icon={Globe} label={t("rfq.wizard.deliveryCountry")} value={countryName(draft.deliveryCountry)} />
                <SummaryRow icon={Users} label={t("rfq.wizard.selectedSuppliers")} value={`${draft.selectedSupplierIds.length} suppliers`} />
                {(draft.financeInterest || draft.leasingInterest) && (
                  <SummaryRow
                    icon={CreditCard}
                    label={t("rfq.wizard.financeLeasing")}
                    value={[draft.financeInterest && "Finance", draft.leasingInterest && "Leasing"].filter(Boolean).join(" · ")}
                  />
                )}
                <SummaryRow label={t("rfq.wizard.budgetRange")} value={draft.budgetRange || formatCurrency(draft.budget)} />
                <SummaryRow label={t("rfq.wizard.responseDeadline")} value={formatDate(draft.responseDeadline)} />
                {draft.companyName && <SummaryRow label={t("rfq.wizard.company")} value={draft.companyName} />}
              </div>
            )}

            {wizardStep === "confirmation" && lastCreatedRfq && (
              <div className="space-y-5 text-center py-4">
                <div className="mx-auto size-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="size-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{t("rfq.wizard.confirmTitle")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("rfq.wizard.confirmSubtitle")}</p>
                </div>
                <div className="surface-card rounded-lg p-4 text-left space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">{lastCreatedRfq.rfqNumber}</p>
                  <StatusBadge variant={lastCreatedRfq.status === "draft" ? "default" : "success"}>
                    {lastCreatedRfq.status === "draft" ? t("rfq.drafts") : t("rfq.wizard.sent")}
                  </StatusBadge>
                  <p className="text-sm font-medium">{lastCreatedRfq.title.en}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 gap-1"
                    onClick={() => {
                      closeCreateRfq();
                      router.push(`/rfq?rfqId=${lastCreatedRfq.id}`);
                    }}
                  >
                    {t("rfq.wizard.viewRfq")} <ChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeCreateRfq();
                      router.push("/rfq");
                    }}
                  >
                    {t("rfq.wizard.goToCenter")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeCreateRfq();
                      openCreateRfq({ source: "generic", mode: "offer", vertical });
                    }}
                  >
                    {t("rfq.wizard.createOfferRequest")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeCreateRfq();
                      router.push("/marketplace");
                    }}
                  >
                    {t("rfq.wizard.backToMarketplace")}
                  </Button>
                </div>
              </div>
            )}

            {wizardStep !== "confirmation" && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                {wizardStep > 1 ? (
                  <Button variant="outline" onClick={() => setWizardStep((wizardStep - 1) as RfqWizardStep)}>
                    <ArrowLeft className="size-4 mr-1" /> {t("rfq.wizard.back")}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={closeCreateRfq}>{t("rfq.wizard.cancel")}</Button>
                )}
                <div className="flex-1" />
                {wizardStep < 5 ? (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 gap-1"
                    disabled={!canNext}
                    onClick={() => goNext()}
                  >
                    {t("rfq.wizard.next")} <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => createRfq({ asDraft: true })}>
                      {t("rfq.wizard.saveDraft")}
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-1" onClick={() => createRfq()}>
                      {t("rfq.wizard.create")} <Check className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100">
      <span className="text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
