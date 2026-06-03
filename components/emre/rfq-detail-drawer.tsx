"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, CreditCard, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { TranslationBadge } from "./translation-badge";
import { OfferComparisonTable } from "./offer-comparison-table";
import { useApp } from "@/context/app-context";
import { useSourcing } from "@/context/sourcing-context";
import { useUi } from "@/lib/ui-i18n";
import { t as localizedText } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RFQ } from "@/data/types";
import { offers } from "@/data/offers";
import { TrustStrip } from "@/components/emre/trust-strip";
import { buyers } from "@/data/buyers";
import { suppliers } from "@/data/suppliers";

export function RFQDetailDrawer({
  rfq,
  open,
  onClose,
}: {
  rfq: RFQ | null;
  open: boolean;
  onClose: () => void;
}) {
  const { language, openConsultation, showToast } = useApp();
  const { t } = useUi();
  const { openCreateGapDrawer } = useSourcing();
  if (!rfq) return null;

  const buyer = buyers.find((b) => b.id === rfq.buyerId);
  const rfqOffers = offers.filter((o) => o.rfqId === rfq.id);
  const selectedSuppliers =
    rfq.selectedSupplierIds?.map((id) => suppliers.find((s) => s.id === id)).filter(Boolean) ?? [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-2xl overflow-hidden p-0">
        <ScrollArea className="h-full p-6 space-y-5">
          <SheetHeader className="text-left">
            <p className="text-xs font-mono text-muted-foreground">
              {(rfq.rfqNumber ?? rfq.id).toUpperCase()}
            </p>
            <SheetTitle>{localizedText(rfq.title, language)}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">{rfq.status.replace("_", " ")}</StatusBadge>
            <StatusBadge variant="default">{rfq.deliveryCountry}</StatusBadge>
            <StatusBadge variant="violet">{rfq.offersCount} offers</StatusBadge>
            {rfq.createdFrom && (
              <StatusBadge variant="default">{rfq.createdFrom.replace("_", " ")}</StatusBadge>
            )}
            <StatusBadge variant="violet">
              <Sparkles className="size-3 mr-1" /> AI Supported
            </StatusBadge>
          </div>

          <div className="surface-card rounded-lg p-4 space-y-2 border border-violet-200">
            <p className="text-xs font-medium text-violet-600 uppercase flex items-center gap-1">
              <Sparkles className="size-3" /> AI RFQ Assistant
            </p>
            <p className="text-sm">
              Procurement AI matched {rfq.matchedSuppliers} suppliers and generated multilingual offer
              templates, and flagged financing options for this request.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => showToast("AI match report generated (demo)")}
              >
                <Sparkles className="size-3" /> AI Match Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => openConsultation()}
              >
                <MessageSquare className="size-3" /> Get Consultation
              </Button>
            </div>
          </div>

          {(rfq.category || rfq.useCase || rfq.industry) && (
            <div className="surface-card rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-blue-600 uppercase">{t("rfq.detail.requirements")}</p>
              {rfq.category && <p className="text-sm"><span className="text-muted-foreground">Category:</span> {rfq.category}</p>}
              {rfq.industry && <p className="text-sm"><span className="text-muted-foreground">Industry:</span> {String(rfq.industry)}</p>}
              {rfq.useCase && <p className="text-sm">{rfq.useCase}</p>}
              {rfq.companyName && <p className="text-sm"><span className="text-muted-foreground">{t("rfq.wizard.company")}:</span> {rfq.companyName}</p>}
              {rfq.sourcingNotes && <p className="text-sm text-amber-800">{rfq.sourcingNotes}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <InfoBox label="Quantity" value={rfq.quantity.toLocaleString()} />
            <InfoBox label="Budget" value={rfq.budgetRange ?? formatCurrency(rfq.budget)} />
            <InfoBox label="Created" value={formatDate(rfq.createdAt)} />
            <InfoBox label="Deadline" value={formatDate(rfq.deadline)} />
            {rfq.deliveryDate && <InfoBox label="Delivery target" value={formatDate(rfq.deliveryDate)} />}
          </div>

          {buyer && (
            <div className="surface-card rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Buyer</p>
              <p className="font-medium">{buyer.name}</p>
              <p className="text-xs text-muted-foreground">
                {buyer.type} · {buyer.country}
              </p>
            </div>
          )}

          {selectedSuppliers.length > 0 && (
            <div className="surface-card rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-blue-600 uppercase">{t("rfq.detail.selectedSuppliers")}</p>
              <div className="space-y-2">
                {selectedSuppliers.map((s) => s && (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.country}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(rfq.financeInterest || rfq.leasingInterest) && (
            <div className="surface-card rounded-lg p-4 space-y-1">
              <p className="text-xs font-medium text-emerald-700 uppercase flex items-center gap-1">
                <CreditCard className="size-3" /> {t("rfq.detail.financeLeasing")}
              </p>
              <p className="text-sm">
                {[rfq.financeInterest && "Financing requested", rfq.leasingInterest && "Leasing requested"]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}

          <TranslationBadge
            status={rfq.translationStatus}
            showPanel
            sourceText={rfq.buyerMessage ?? rfq.message.en}
          />

          <div className="surface-card rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-blue-600 uppercase">Buyer Message</p>
            <p className="text-sm">{rfq.buyerMessage ?? localizedText(rfq.message, language)}</p>
          </div>

          {rfq.translatedMessage && (
            <div className="surface-card rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-violet-600 uppercase">{t("rfq.detail.translatedMessage")}</p>
              <p className="text-sm">{rfq.translatedMessage}</p>
            </div>
          )}

          {rfq.statusTimeline && rfq.statusTimeline.length > 0 && (
            <div className="surface-card rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-blue-600 uppercase flex items-center gap-1">
                <Clock className="size-3" /> {t("rfq.detail.statusTimeline")}
              </p>
              <ul className="space-y-2 text-sm">
                {rfq.statusTimeline.map((entry, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">{formatDate(entry.timestamp)}</span>
                    <span>{entry.status}{entry.note ? ` — ${entry.note}` : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rfqOffers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-600 uppercase">{t("rfq.detail.offerComparison")}</p>
              <OfferComparisonTable offers={rfqOffers} />
            </div>
          ) : (
            <div className="surface-card rounded-lg p-6 text-center text-muted-foreground text-sm space-y-1">
              <p>{t("rfq.detail.offerComparisonPlaceholder")}</p>
              <p className="text-xs">{rfq.matchedSuppliers} suppliers notified</p>
            </div>
          )}

          {rfq.matchedSuppliers < 3 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
              <p className="text-sm text-amber-900">{t("sourcing.weakSupplierCoverage")}</p>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  openCreateGapDrawer({
                    source: "rfq",
                    requestedProduct: localizedText(rfq.title, language),
                    linkedRfqIds: [rfq.id],
                    country: rfq.deliveryCountry,
                    expectedBudget: rfq.budget,
                    urgency: "high",
                  })
                }
              >
                {t("sourcing.sendToSourcingDesk")}
              </Button>
            </div>
          )}

          <TrustStrip compact />

          <div className="surface-card rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-blue-600 uppercase">{t("rfq.detail.nextActions")}</p>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => showToast("Best offer accepted (demo)")}>
                Accept Best Offer
              </Button>
              <Button variant="outline" onClick={() => showToast("Message sent to suppliers (demo)")}>
                Send Message
              </Button>
              <Button variant="outline" onClick={() => showToast("RFQ resent to matched suppliers")}>
                {t("rfq.detail.resendRfq")}
              </Button>
              {rfq.status === "draft" && (
                <Button variant="outline" onClick={() => showToast("Draft opened for editing")}>
                  {t("rfq.detail.editDraft")}
                </Button>
              )}
              <Button variant="outline" onClick={() => showToast("Multilingual offer pack generated")}>
                Generate Multilingual Offer
              </Button>
              <Link href="/finance">
                <Button variant="outline" className="gap-1">
                  <CreditCard className="size-3" /> Compare Leasing
                </Button>
              </Link>
              <Button variant="outline" onClick={() => openConsultation()}>
                Sales Consultation
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
