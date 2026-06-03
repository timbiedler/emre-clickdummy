"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  GitCompare,
  MessageSquare,
  Minus,
  Plus,
  Sparkles,
  Play,
  MapPin,
  CreditCard,
  Truck,
  Wrench,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/emre/status-badge";
import { TranslationBadge } from "@/components/emre/translation-badge";
import { ProductImagePlaceholder } from "@/components/emre/product-image-placeholder";
import { ProductCard } from "@/components/emre/product-card";
import { TrustStrip } from "@/components/emre/trust-strip";
import { RelevanceBadge } from "@/components/emre/relevance-badge";
import { useApp } from "@/context/app-context";
import { useCommerce } from "@/context/commerce-context";
import { useRfq } from "@/context/rfq-context";
import { getAllProducts } from "@/data";
import { suppliers } from "@/data/suppliers";
import { servicepoints } from "@/data/servicepoints";
import { t, label } from "@/lib/i18n";
import { useCheckoutT } from "@/lib/checkout-labels";
import { useUi } from "@/lib/ui-i18n";
import { formatCurrency } from "@/lib/format";
import { getProductFinance, financeStatusLabel, financeStatusVariant } from "@/lib/product-finance";
import { getProductIndustries, getIndustryUseCases } from "@/lib/industry-relevance";
import type { Product } from "@/data/types";
import { globalBudgetMock } from "@/data/checkout";

export function ProductDetailView({
  product,
  onViewSupplier,
}: {
  product: Product;
  onViewSupplier?: (id: string) => void;
}) {
  const router = useRouter();
  const ct = useCheckoutT();
  const { t: uiT } = useUi();
  const { language, toggleCompare, compareList, openConsultation, industry, showToast, setProductAlert, alertProductIds } = useApp();
  const { addToCart, setCheckoutDraft, setCheckoutStep, openProductDetail } = useCommerce();
  const { openCreateRfq } = useRfq();
  const [qty, setQty] = useState(1);

  const supplier = suppliers.find((s) => s.id === product.supplierId);
  const finance = getProductFinance(product);
  const tierPrice =
    product.priceTiers.filter((t) => qty >= t.minQty).pop()?.price ?? product.price;
  const { primary } = getProductIndustries(product);
  const useCases = getIndustryUseCases(product);
  const related = getAllProducts().filter((p) => product.relatedIds.includes(p.id)).slice(0, 4);
  const servicePartner = servicepoints.find(
    (sp) => sp.vertical === product.vertical && sp.country === product.primaryCountry
  );

  const startCheckout = (path: "purchase" | "leasing") => {
    addToCart(product.id, qty);
    setCheckoutDraft({ checkoutPath: path, paymentMethod: path === "leasing" ? "leasing" : "invoice", leasingDownPayment: finance.downPayment, leasingTerm: finance.termMonths });
    setCheckoutStep(1);
    router.push("/checkout");
  };

  const tabLabels: Record<string, string> = {
    overview: uiT("productDetail.overview"),
    specs: uiT("productDetail.specs"),
    documents: uiT("productDetail.documents"),
    finance: uiT("productDetail.financeLeasing"),
    delivery: uiT("productDetail.delivery"),
    service: uiT("productDetail.service"),
    warranty: uiT("productDetail.warrantyInsurance"),
    training: uiT("productDetail.training"),
    supplier: uiT("productDetail.supplier"),
    related: uiT("productDetail.related"),
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <ProductImagePlaceholder product={product} className="h-48 sm:h-56" size="lg" />
        <Button size="sm" variant="secondary" className="absolute bottom-3 right-3 gap-2 surface-card" onClick={() => showToast("Video preview opened (mock)")}>
          <Play className="size-4" /> Video Preview
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge variant="info">{product.category}</StatusBadge>
        <StatusBadge variant="violet">{product.brand}</StatusBadge>
        <StatusBadge variant="default">{product.vertical}</StatusBadge>
        {primary.slice(0, 2).map((ind) => (
          <RelevanceBadge key={ind} label={ind} type={ind === industry ? "recommended" : "facility"} />
        ))}
        <StatusBadge variant="default">
          <MapPin className="size-3 mr-1" />
          {product.primaryCountry}
        </StatusBadge>
        <StatusBadge variant={product.availability === "in_stock" ? "success" : "warning"}>
          {product.availability.replace("_", " ")}
        </StatusBadge>
        {product.serviceCoverage && (
          <StatusBadge variant="info">
            <Wrench className="size-3 mr-1" />
            {uiT("productDetail.serviceCoverage")}
          </StatusBadge>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900">{t(product.name, language)}</h2>
        <p className="text-sm text-slate-500 mt-1">SKU: {product.sku} · {product.supplierName}</p>
        {supplier && (
          <p className="text-xs text-slate-500 mt-1">
            Supplier score mock: {85 + (product.id.charCodeAt(0) % 12)}% · RFQ acceptance {92}%
          </p>
        )}
      </div>

      <TrustStrip />

      <div className="surface-card rounded-xl p-4 grid sm:grid-cols-2 gap-4 border border-slate-200">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 uppercase">{ct("checkout.buy")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(tierPrice * qty)}</p>
            <p className="text-xs text-slate-500">{formatCurrency(tierPrice)} / unit</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">{ct("checkout.leasing")}</p>
            <p className="text-lg font-semibold text-emerald-700">
              {formatCurrency(finance.leasingRateMonthly)} / mo
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Truck className="size-3.5" />
            {ct("checkout.deliveryEstimate")}: {product.deliveryDays}–{product.deliveryDays + 3} business days
          </div>
          <StatusBadge variant={financeStatusVariant[finance.status]}>
            <CreditCard className="size-3 mr-1" />
            {financeStatusLabel[finance.status]}
          </StatusBadge>
        </div>
        <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{ct("checkout.quantity")}</span>
            <Button variant="outline" size="icon" className="size-8" onClick={() => setQty(Math.max(1, qty - 1))}>
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <Button variant="outline" size="icon" className="size-8" onClick={() => setQty(qty + 1)}>
              <Plus className="size-3" />
            </Button>
          </div>
          {product.priceTiers.length > 1 && (
            <div className="text-xs text-slate-500 space-y-0.5">
              <p className="font-medium text-slate-700">{uiT("productDetail.volumeTiers")}</p>
              {product.priceTiers.map((tier) => (
                <p key={tier.minQty}>
                  ≥{tier.minQty}: {formatCurrency(tier.price)}
                </p>
              ))}
            </div>
          )}
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => addToCart(product.id, qty)}>
            {ct("checkout.addToCart")}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => startCheckout("purchase")}>
            {ct("checkout.proceedCheckout")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-50 p-1">
          {(["overview", "specs", "documents", "finance", "delivery", "service", "warranty", "training", "supplier", "related"] as const).map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs">
              {tabLabels[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-3 text-sm">
          <p className="font-medium">{uiT("productDetail.aiSummary")}</p>
          <p className="text-slate-700 leading-relaxed">{t(product.aiSummary, language)}</p>
          <p>{t(product.description, language)}</p>
          <TranslationBadge status={product.translationStatus} showPanel sourceText={product.description.en} />
          <p className="font-medium pt-2">{uiT("productDetail.useCases")}</p>
          <ul className="list-disc pl-4 text-slate-600 space-y-1">{useCases.map((u) => <li key={u}>{u}</li>)}</ul>
          <div className="flex flex-wrap gap-1">
            {product.salesChannels.map((c) => (
              <StatusBadge key={c} variant="info">{c}</StatusBadge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="surface-card rounded-lg p-2.5">
                <span className="text-slate-500">{k}: </span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4 space-y-2">
          {product.documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between surface-card rounded-lg px-3 py-2 text-sm">
              <span className="flex items-center gap-2">
                <FileText className="size-4 text-blue-600" />
                {doc.name}
              </span>
              <StatusBadge variant={doc.status === "verified" ? "success" : doc.status === "pending" ? "warning" : "danger"}>
                {doc.status}
              </StatusBadge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/data-room"><Upload className="size-4" />{ct("checkout.uploadDocuments")}</Link>
          </Button>
        </TabsContent>

        <TabsContent value="finance" className="mt-4 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="surface-card p-3"><p className="text-xs text-slate-500">{ct("checkout.buy")}</p><p className="font-semibold">{formatCurrency(tierPrice)}</p></div>
            <div className="surface-card p-3"><p className="text-xs text-slate-500">{ct("checkout.leasing")}</p><p className="font-semibold text-emerald-700">{formatCurrency(finance.leasingRateMonthly)}/mo</p></div>
          </div>
          <p className="text-xs text-slate-500">{ct("checkout.estimatedRate")} · {finance.termMonths} mo · Down {formatCurrency(finance.downPayment)}</p>
          <p className="text-xs text-amber-800 bg-amber-50 rounded-lg p-2">{ct("checkout.finalApprovalNote")}</p>
          <div className="surface-card p-3">
            <p className="text-xs font-medium mb-2">{ct("checkout.globalBudget")}</p>
            <p className="text-sm">{formatCurrency(globalBudgetMock.remaining)} remaining of {formatCurrency(globalBudgetMock.total)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => startCheckout("leasing")}>{ct("checkout.startLeasingCheckout")}</Button>
            <Button size="sm" variant="outline" asChild><Link href="/data-room">{ct("checkout.uploadDocuments")}</Link></Button>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4 text-sm space-y-2">
          <p>{ct("checkout.deliveryEstimate")}: {product.deliveryDays}–{product.deliveryDays + 3} business days</p>
          <p>Shipping countries: {product.countries.slice(0, 5).join(", ")}{product.countries.length > 5 ? "…" : ""}</p>
          <p>Carriers: DHL Freight, DPD Business, UPS Supply Chain</p>
          <p>Warehouse: EU central hub · Partial shipment supported</p>
        </TabsContent>

        <TabsContent value="service" className="mt-4 text-sm space-y-2">
          {servicePartner ? (
            <>
              <p>{servicePartner.name} · {servicePartner.country}</p>
              <p>Response: {servicePartner.responseTime}</p>
            </>
          ) : (
            <p className="text-slate-500">Service partner assignment on order confirmation</p>
          )}
          <Button size="sm" variant="outline" asChild><Link href="/service-network">Service ticket CTA</Link></Button>
        </TabsContent>

        <TabsContent value="warranty" className="mt-4 text-sm space-y-2">
          <p>Standard warranty: {product.warrantyMonths ?? 12} months</p>
          <p>Extended warranty from €49/mo · Device insurance from €35/mo</p>
        </TabsContent>

        <TabsContent value="training" className="mt-4 text-sm space-y-2">
          <Button size="sm" variant="outline" asChild><Link href="/training">Product training courses</Link></Button>
          <p className="text-slate-500">Sales & service training modules available for partners</p>
        </TabsContent>

        <TabsContent value="supplier" className="mt-4">
          {supplier && (
            <div className="surface-card p-4 space-y-2 text-sm">
              <p className="font-medium">{supplier.name}</p>
              <p className="text-slate-500">{supplier.country} · {supplier.responseTime}</p>
              <Button size="sm" variant="outline" onClick={() => onViewSupplier?.(supplier.id)}>
                {label("viewSupplier", language)}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => openProductDetail(p.id)} showActions={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <TrustStrip compact />

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            openCreateRfq({
              source: "product",
              mode: "offer",
              productId: product.id,
              quantity: qty,
              vertical: product.vertical,
            })
          }
        >
          <MessageSquare className="size-4" />{ct("checkout.offer")}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => startCheckout("leasing")}>
          {ct("checkout.calculateLeasing")}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => toggleCompare(product.id)}>
          <GitCompare className="size-4" />Compare{compareList.includes(product.id) ? " ✓" : ""}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => openConsultation(product.id)}>
          <Sparkles className="size-4" />{ct("checkout.askAi")}
        </Button>
        <Button
          variant="outline"
          className="gap-2 col-span-2"
          onClick={() => setProductAlert(product.id)}
        >
          <Bell className="size-4" />
          {alertProductIds.includes(product.id) ? "Alert active" : ct("checkout.setAlert")}
        </Button>
      </div>
    </div>
  );
}
