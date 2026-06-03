"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, CreditCard, MessageSquare } from "lucide-react";
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
import { buyers } from "@/data/buyers";

export function RFQDetailDrawer({
  rfq,
  open,
  onClose,
}: {
  rfq: RFQ | null;
  open: boolean;
  onClose: () => void;
}) {
  const { language, openConsultation } = useApp();
  const { t } = useUi();
  const { openCreateGapDrawer } = useSourcing();
  if (!rfq) return null;

  const buyer = buyers.find((b) => b.id === rfq.buyerId);
  const rfqOffers = offers.filter((o) => o.rfqId === rfq.id);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-2xl overflow-hidden p-0">
        <ScrollArea className="h-full p-6 space-y-5">
          <SheetHeader className="text-left">
            <p className="text-xs font-mono text-muted-foreground">{rfq.id.toUpperCase()}</p>
            <SheetTitle>{localizedText(rfq.title, language)}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">{rfq.status.replace("_", " ")}</StatusBadge>
            <StatusBadge variant="default">{rfq.deliveryCountry}</StatusBadge>
            <StatusBadge variant="violet">{rfq.offersCount} offers</StatusBadge>
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
              <Button size="sm" variant="outline" className="gap-1">
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

          <div className="grid grid-cols-2 gap-3">
            <InfoBox label="Quantity" value={rfq.quantity.toLocaleString()} />
            <InfoBox label="Budget" value={formatCurrency(rfq.budget)} />
            <InfoBox label="Created" value={formatDate(rfq.createdAt)} />
            <InfoBox label="Deadline" value={formatDate(rfq.deadline)} />
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

          <TranslationBadge
            status={rfq.translationStatus}
            showPanel
            sourceText={rfq.message.en}
          />

          <div className="surface-card rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-blue-600 uppercase">Buyer Message</p>
            <p className="text-sm">{localizedText(rfq.message, language)}</p>
          </div>

          {rfqOffers.length > 0 ? (
            <OfferComparisonTable offers={rfqOffers} />
          ) : (
            <div className="surface-card rounded-lg p-6 text-center text-muted-foreground text-sm">
              Supplier matching in progress — {rfq.matchedSuppliers} suppliers notified
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

          <div className="flex flex-wrap gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">Accept Best Offer</Button>
            <Button variant="outline">Send Message</Button>
            <Button variant="outline">Generate Multilingual Offer</Button>
            <Link href="/finance">
              <Button variant="outline" className="gap-1">
                <CreditCard className="size-3" /> Compare Leasing
              </Button>
            </Link>
            <Button variant="outline" onClick={() => openConsultation()}>
              Sales Consultation
            </Button>
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
