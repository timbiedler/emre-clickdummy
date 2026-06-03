"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { useCommerce } from "@/context/commerce-context";
import { useCheckoutT } from "@/lib/checkout-labels";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function ConfirmationContent() {
  const ct = useCheckoutT();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const orderId = searchParams.get("order");
  const { placedOrders, dataRoomUploadProgress, simulateDataRoomUpload, resetCheckoutDraft } = useCommerce();

  const meta = placedOrders.find(
    (m) => m.confirmationNumber === ref || m.order.id === orderId
  ) ?? placedOrders[0];

  const isFinance = Boolean(
    meta &&
      (meta.order.paymentStatus === "financed" || meta.order.financeMethod)
  );

  if (!meta) {
    return (
      <div className="surface-card p-8 text-center space-y-4">
        <p className="text-slate-600">No confirmation found.</p>
        <Button asChild><Link href="/marketplace">{ct("checkout.backToMarketplace")}</Link></Button>
      </div>
    );
  }

  const { order, confirmationNumber, missingDocuments } = meta;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="surface-card p-8 text-center space-y-4 border border-emerald-200 bg-emerald-50/50">
        <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-semibold text-slate-900">{ct("checkout.confirmed")}</h2>
        <p className="text-sm text-slate-600">{confirmationNumber}</p>
        <StatusBadge variant="success">{order.status}</StatusBadge>
      </div>

      <div className="surface-card p-6 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-slate-500">Order</p><p className="font-mono font-medium">{order.id.toUpperCase()}</p></div>
          <div><p className="text-xs text-slate-500">Payment</p><p className="font-medium capitalize">{order.paymentStatus}</p></div>
          <div><p className="text-xs text-slate-500">{ct("checkout.total")}</p><p className="font-medium">{formatCurrency(order.amount)}</p></div>
          <div><p className="text-xs text-slate-500">{ct("checkout.deliveryEstimate")}</p><p className="font-medium">{order.eta}</p></div>
          {order.leasingMonthly && (
            <div><p className="text-xs text-slate-500">{ct("checkout.monthlyPackage")}</p><p className="font-medium text-emerald-700">{formatCurrency(order.leasingMonthly)}/mo</p></div>
          )}
          <div><p className="text-xs text-slate-500">{ct("checkout.supplierConfirmation")}</p><p className="font-medium">Pending</p></div>
        </div>
        <p className="text-slate-600">{order.productName} · {order.buyerCompany}</p>
        <p className="text-xs text-slate-500">Tracking: {order.trackingNumber} · {order.carrier}</p>
      </div>

      {isFinance && (
        <div className="surface-card p-6 space-y-3">
          <p className="font-medium flex items-center gap-2"><FileText className="size-4" />{ct("checkout.dataRoom")}</p>
          <Progress value={dataRoomUploadProgress} />
          <p className="text-xs text-slate-600">{ct("checkout.missingDocuments")}: {missingDocuments}</p>
          <Button variant="outline" size="sm" className="gap-2" onClick={simulateDataRoomUpload}>
            <Upload className="size-4" />{ct("checkout.uploadDocuments")}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild className="bg-blue-600"><Link href={`/orders?orderId=${order.id}`}>{ct("checkout.viewOrder")}</Link></Button>
        <Button variant="outline">{ct("checkout.downloadConfirmation")}</Button>
        <Button variant="outline">{ct("checkout.openTracking")}</Button>
        <Button variant="outline" asChild><Link href="/data-room">{ct("checkout.uploadDocuments")}</Link></Button>
        <Button variant="outline" asChild onClick={() => resetCheckoutDraft()}><Link href="/marketplace">{ct("checkout.backToMarketplace")}</Link></Button>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage() {
  const ct = useCheckoutT();
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <PageHeader title={ct("checkout.confirmation")} />
      <ConfirmationContent />
    </Suspense>
  );
}
