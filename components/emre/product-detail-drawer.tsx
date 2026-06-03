"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Play,
  GitCompare,
  MessageSquare,
  Truck,
  MapPin,
} from "lucide-react";
import { StatusBadge } from "./status-badge";
import { TranslationBadge } from "./translation-badge";
import { ProductImagePlaceholder } from "./product-image-placeholder";
import { ProductFinanceSection } from "./product-finance-section";
import { ProductAiAdvisorSection } from "./product-ai-advisor-section";
import { useApp } from "@/context/app-context";
import { t, label } from "@/lib/i18n";
import type { Product } from "@/data/types";
import { suppliers } from "@/data/suppliers";
import Link from "next/link";

export function ProductDetailDrawer({
  product,
  open,
  onClose,
  onViewSupplier,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onViewSupplier?: (id: string) => void;
}) {
  const { language, toggleCompare, compareList, openConsultation } = useApp();
  if (!product) return null;

  const supplier = suppliers.find((s) => s.id === product.supplierId);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-2xl overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="relative">
            <ProductImagePlaceholder product={product} className="h-52" size="lg" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button size="sm" variant="secondary" className="gap-2 surface-card">
                <Play className="size-4" /> Video Preview
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <SheetHeader className="text-left space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge variant="info">{product.category}</StatusBadge>
                <StatusBadge variant="violet">{product.brand}</StatusBadge>
                <StatusBadge variant="default">
                  <MapPin className="size-3 mr-1" />
                  {product.primaryCountry}
                </StatusBadge>
              </div>
              <SheetTitle className="text-xl">{t(product.name, language)}</SheetTitle>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </SheetHeader>

            <p className="text-sm text-foreground/90 leading-relaxed">
              {t(product.description, language)}
            </p>

            <TranslationBadge
              status={product.translationStatus}
              showPanel
              sourceText={product.description.en}
            />

            <ProductFinanceSection product={product} />
            <ProductAiAdvisorSection product={product} />

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Specifications
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="surface-card rounded-lg p-2.5 text-sm">
                    <span className="text-muted-foreground">{k}: </span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Documents & Compliance
              </p>
              <div className="space-y-1.5">
                {product.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between surface-card rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-4 text-blue-600" />
                      {doc.name}
                    </span>
                    <StatusBadge
                      variant={
                        doc.status === "verified"
                          ? "success"
                          : doc.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {doc.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </div>

            {supplier && (
              <div className="surface-card rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="font-medium">{product.supplierName}</p>
                  <p className="text-xs text-muted-foreground">
                    {supplier.country} · Response {supplier.responseTime}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSupplier?.(supplier.id)}
                >
                  {label("viewSupplier", language)}
                </Button>
              </div>
            )}

            <Separator className="bg-white/10" />

            <div className="grid grid-cols-2 gap-2">
              <Link href="/rfq">
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="size-4" />
                  Request Offer
                </Button>
              </Link>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => openConsultation(product.id)}
              >
                Get Consultation
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toggleCompare(product.id)}
              >
                <GitCompare className="size-4" />
                Compare
                {compareList.includes(product.id) && " ✓"}
              </Button>
              <Link href="/finance">
                <Button variant="outline" className="w-full gap-2">
                  Leasing Options
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="size-3" />
              Delivery: {product.deliveryDays} days · Stock: {product.stock.toLocaleString()}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
