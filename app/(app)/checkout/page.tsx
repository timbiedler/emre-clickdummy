"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { useCommerce } from "@/context/commerce-context";
import { useRfq } from "@/context/rfq-context";
import { getAllProducts } from "@/data";
import {
  globalBudgetMock,
  mollieMethods,
  paymentMethods,
  savedAddresses,
  leasingTerms,
  requiredFinanceDocuments,
} from "@/data/checkout";
import { useCheckoutT } from "@/lib/checkout-labels";
import { formatCurrency } from "@/lib/format";
import { t as localizedText } from "@/lib/i18n";
import { getProductFinance } from "@/lib/product-finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const ct = useCheckoutT();
  const router = useRouter();
  const { language, vertical } = useApp();
  const {
    cart,
    cartTotals,
    checkoutDraft,
    setCheckoutDraft,
    checkoutStep,
    setCheckoutStep,
    placeOrder,
    dataRoomUploadProgress,
    simulateDataRoomUpload,
  } = useCommerce();
  const { openCreateRfq } = useRfq();

  const products = getAllProducts();
  const totals = cartTotals();
  const billing = savedAddresses.find((a) => a.id === checkoutDraft.addressId) ?? savedAddresses[0];
  const isFinance =
    checkoutDraft.paymentMethod === "leasing" ||
    checkoutDraft.paymentMethod === "financing" ||
    checkoutDraft.paymentMethod === "finetrading";

  const leasingCalc = useMemo(() => {
    const line = cart[0];
    const p = line ? products.find((x) => x.id === line.productId) : null;
    if (!p) return totals.leasingMonthly;
    const fin = getProductFinance(p);
    const financed = fin.purchasePrice - checkoutDraft.leasingDownPayment;
    return Math.round((financed * 1.055) / checkoutDraft.leasingTerm) + totals.serviceTotal;
  }, [cart, products, checkoutDraft, totals]);

  if (cart.length === 0 && checkoutStep < 5) {
    return (
      <div className="space-y-6">
        <PageHeader titleKey="checkout.title" />
        <div className="surface-card p-8 text-center space-y-4">
          <p className="text-slate-600">{ct("checkout.cart")} is empty</p>
          <Button asChild><Link href="/marketplace">{ct("checkout.backToMarketplace")}</Link></Button>
        </div>
      </div>
    );
  }

  const stepLabels = [
    ct("checkout.cart"),
    ct("checkout.companyDelivery"),
    ct("checkout.paymentFinance"),
    ct("checkout.review"),
  ];

  const handlePlaceOrder = () => {
    const meta = placeOrder({
      vertical,
      language,
      country: checkoutDraft.deliveryCountry,
      companyName: billing.company,
    });
    router.push(`/checkout/confirmation?ref=${meta.confirmationNumber}&order=${meta.order.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title={ct("checkout.title")} description={billing.company} />

      <div className="flex gap-2 flex-wrap">
        {stepLabels.map((label, i) => (
          <div
            key={label}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium border",
              checkoutStep === i + 1
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : checkoutStep > i + 1
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-white border-slate-200 text-slate-500"
            )}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {checkoutStep === 1 && (
        <div className="surface-card p-6 space-y-4">
          <h3 className="font-semibold">{ct("checkout.cart")}</h3>
          {cart.map((line) => {
            const p = products.find((x) => x.id === line.productId)!;
            return (
              <div key={line.productId} className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                <div>
                  <p className="font-medium">{localizedText(p.name, language)}</p>
                  <p className="text-slate-500">Qty {line.quantity} · {p.deliveryDays}d delivery</p>
                </div>
                <p className="font-semibold">{formatCurrency(p.price * line.quantity)}</p>
              </div>
            );
          })}
          <div className="text-sm space-y-1 pt-2">
            <div className="flex justify-between"><span>{ct("checkout.total")}</span><span className="font-semibold">{formatCurrency(totals.total)}</span></div>
            <div className="flex justify-between text-emerald-700"><span>{ct("checkout.monthlyPackage")}</span><span>{formatCurrency(totals.leasingMonthly)}/mo</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-blue-600" onClick={() => setCheckoutStep(2)}>{ct("checkout.next")}</Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const line = cart[0];
                const p = line ? products.find((x) => x.id === line.productId) : null;
                openCreateRfq({
                  source: "checkout",
                  mode: "rfq",
                  vertical,
                  productId: p?.id,
                  quantity: line?.quantity,
                });
              }}
            >
              {ct("checkout.offer")}
            </Button>
          </div>
        </div>
      )}

      {checkoutStep === 2 && (
        <div className="surface-card p-6 space-y-4">
          <h3 className="font-semibold">{ct("checkout.companyDelivery")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{ct("checkout.purchaseOrder")}</Label>
              <Input value={checkoutDraft.poNumber} onChange={(e) => setCheckoutDraft({ poNumber: e.target.value })} placeholder="PO-2026-0142" />
            </div>
            <div className="space-y-2">
              <Label>Requested delivery date</Label>
              <Input type="date" value={checkoutDraft.requestedDeliveryDate} onChange={(e) => setCheckoutDraft({ requestedDeliveryDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Saved address</Label>
            <Select value={checkoutDraft.addressId} onValueChange={(v) => setCheckoutDraft({ addressId: v, deliveryAddressId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {savedAddresses.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="surface-card rounded-lg p-4 text-sm space-y-1 bg-slate-50">
            <p className="font-medium">{billing.company}</p>
            <p>{billing.street}, {billing.postalCode} {billing.city}</p>
            <p>VAT {billing.vatId} · {billing.contact}</p>
            <p>{billing.email} · {billing.phone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCheckoutStep(1)}>{ct("checkout.back")}</Button>
            <Button className="bg-blue-600" onClick={() => setCheckoutStep(3)}>{ct("checkout.next")}</Button>
          </div>
        </div>
      )}

      {checkoutStep === 3 && (
        <div className="space-y-4">
          <div className="surface-card p-6 space-y-3">
            <h3 className="font-semibold">{ct("checkout.paymentFinance")}</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setCheckoutDraft({ paymentMethod: pm.id })}
                  className={cn(
                    "text-left rounded-lg border p-3 text-sm transition-colors",
                    checkoutDraft.paymentMethod === pm.id ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <p className="font-medium">{ct(pm.labelKey)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ct(pm.descriptionKey)}</p>
                  {pm.logoText && <p className="text-[10px] text-slate-400 mt-1">{pm.logoText}</p>}
                </button>
              ))}
            </div>
          </div>

          {checkoutDraft.paymentMethod === "mollie" && (
            <div className="surface-card p-4 space-y-2">
              <p className="text-sm font-medium">{ct("checkout.mollieMethods")}</p>
              <div className="flex flex-wrap gap-2">
                {mollieMethods.map((m) => (
                  <Button
                    key={m.id}
                    size="sm"
                    variant={checkoutDraft.mollieMethod === m.id ? "default" : "outline"}
                    onClick={() => setCheckoutDraft({ mollieMethod: m.id })}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {(checkoutDraft.paymentMethod === "leasing" || checkoutDraft.paymentMethod === "financing") && (
            <div className="surface-card p-6 space-y-4">
              <h4 className="font-medium">{ct("checkout.leasing")} calculator</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Term (months)</Label>
                  <Select value={String(checkoutDraft.leasingTerm)} onValueChange={(v) => setCheckoutDraft({ leasingTerm: Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {leasingTerms.map((t) => (
                        <SelectItem key={t} value={String(t)}>{t} mo</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Down payment €</Label>
                  <Input type="number" value={checkoutDraft.leasingDownPayment} onChange={(e) => setCheckoutDraft({ leasingDownPayment: Number(e.target.value) })} />
                </div>
                <div className="surface-card p-3 bg-emerald-50">
                  <p className="text-xs text-emerald-800">{ct("checkout.estimatedRate")}</p>
                  <p className="text-lg font-semibold text-emerald-900">{formatCurrency(leasingCalc)}/mo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{ct("checkout.readinessScore")}</span>
                  <span>{dataRoomUploadProgress}%</span>
                </div>
                <Progress value={dataRoomUploadProgress} />
                <ul className="text-xs text-slate-600 space-y-1">
                  {requiredFinanceDocuments.slice(0, 4).map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="gap-2" onClick={simulateDataRoomUpload}>
                  {ct("checkout.uploadDocuments")} (mock)
                </Button>
              </div>
            </div>
          )}

          {checkoutDraft.paymentMethod === "global_budget" && (
            <div className="surface-card p-4 text-sm">
              <p>{formatCurrency(globalBudgetMock.remaining)} {ct("checkout.globalBudget")}</p>
              <StatusBadge variant="success" className="mt-2">{globalBudgetMock.status}</StatusBadge>
              <Button size="sm" className="mt-3">{ct("checkout.useBudget")}</Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCheckoutStep(2)}>{ct("checkout.back")}</Button>
            <Button className="bg-blue-600" onClick={() => setCheckoutStep(4)}>{ct("checkout.next")}</Button>
          </div>
        </div>
      )}

      {checkoutStep === 4 && (
        <div className="surface-card p-6 space-y-4">
          <h3 className="font-semibold">{ct("checkout.review")}</h3>
          <div className="text-sm space-y-2">
            {cart.map((line) => {
              const p = products.find((x) => x.id === line.productId)!;
              return (
                <div key={line.productId} className="flex justify-between">
                  <span>{localizedText(p.name, language)} × {line.quantity}</span>
                  <span>{formatCurrency(p.price * line.quantity)}</span>
                </div>
              );
            })}
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between"><span>{ct("checkout.subtotal")}</span><span>{formatCurrency(totals.subtotal)}</span></div>
              <div className="flex justify-between"><span>{ct("checkout.vat")}</span><span>{formatCurrency(totals.vat)}</span></div>
              <div className="flex justify-between font-semibold"><span>{ct("checkout.total")}</span><span>{formatCurrency(totals.total)}</span></div>
              {isFinance && (
                <div className="flex justify-between text-emerald-700"><span>{ct("checkout.monthlyPackage")}</span><span>{formatCurrency(leasingCalc)}/mo</span></div>
              )}
            </div>
            <p className="text-slate-500">
              Payment:{" "}
              {paymentMethods.find((pm) => pm.id === checkoutDraft.paymentMethod)
                ? ct(paymentMethods.find((pm) => pm.id === checkoutDraft.paymentMethod)!.labelKey)
                : checkoutDraft.paymentMethod}
            </p>
            <p className="text-slate-500">{ct("checkout.deliveryEstimate")}: {cart[0] && products.find((p) => p.id === cart[0].productId)?.deliveryDays} business days</p>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={checkoutDraft.termsAccepted}
              onCheckedChange={(v) => setCheckoutDraft({ termsAccepted: Boolean(v) })}
            />
            <Label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">{ct("checkout.termsAccept")}</Label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCheckoutStep(3)}>{ct("checkout.back")}</Button>
            <Button className="bg-blue-600" disabled={!checkoutDraft.termsAccepted} onClick={handlePlaceOrder}>
              {ct("checkout.placeOrder")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
