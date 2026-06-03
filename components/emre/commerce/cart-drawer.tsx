"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/context/commerce-context";
import { useRfq } from "@/context/rfq-context";
import { getAllProducts } from "@/data";
import { formatCurrency } from "@/lib/format";
import { useCheckoutT } from "@/lib/checkout-labels";
import { t as localizedText } from "@/lib/i18n";
import { useApp } from "@/context/app-context";
import { servicePackages } from "@/data/checkout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CartDrawer() {
  const ct = useCheckoutT();
  const { language, vertical } = useApp();
  const router = useRouter();
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartLine,
    removeFromCart,
    cartTotals,
    setCheckoutStep,
  } = useCommerce();
  const { openCreateRfq } = useRfq();
  const products = getAllProducts();
  const totals = cartTotals();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            {ct("checkout.cart")} ({cart.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 flex flex-col h-[calc(100%-4rem)]">
          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">Cart is empty</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {cart.map((line) => {
                const product = products.find((p) => p.id === line.productId);
                if (!product) return null;
                const price =
                  product.priceTiers.filter((t) => line.quantity >= t.minQty).pop()?.price ??
                  product.price;
                return (
                  <div key={line.productId} className="surface-card rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium line-clamp-2">{localizedText(product.name, language)}</p>
                      <button type="button" onClick={() => removeFromCart(line.productId)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">{product.supplierName}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartLine(line.productId, { quantity: Math.max(1, line.quantity - 1) })}>
                        <Minus className="size-3" />
                      </Button>
                      <span>{line.quantity}</span>
                      <Button variant="outline" size="icon" className="size-7" onClick={() => updateCartLine(line.productId, { quantity: line.quantity + 1 })}>
                        <Plus className="size-3" />
                      </Button>
                      <span className="ml-auto font-semibold">{formatCurrency(price * line.quantity)}</span>
                    </div>
                    <Select value={line.servicePackageId} onValueChange={(v) => updateCartLine(line.productId, { servicePackageId: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Service" /></SelectTrigger>
                      <SelectContent>
                        {servicePackages.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          )}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>{ct("checkout.subtotal")}</span><span>{formatCurrency(totals.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>{ct("checkout.shipping")}</span><span>{formatCurrency(totals.shipping)}</span></div>
              <div className="flex justify-between text-slate-500"><span>{ct("checkout.vat")}</span><span>{formatCurrency(totals.vat)}</span></div>
              <div className="flex justify-between font-semibold text-base"><span>{ct("checkout.total")}</span><span>{formatCurrency(totals.total)}</span></div>
              <div className="flex justify-between text-emerald-700 text-xs"><span>{ct("checkout.monthlyPackage")}</span><span>{formatCurrency(totals.leasingMonthly)}/mo</span></div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                onClick={() => {
                  setCheckoutStep(1);
                  setCartOpen(false);
                  router.push("/checkout");
                }}
              >
                {ct("checkout.proceedCheckout")}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const line = cart[0];
                  const product = line ? products.find((p) => p.id === line.productId) : null;
                  setCartOpen(false);
                  openCreateRfq({
                    source: "checkout",
                    mode: "rfq",
                    vertical,
                    productId: product?.id,
                    quantity: line?.quantity,
                  });
                }}
              >
                {ct("checkout.offer")}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/marketplace">{ct("checkout.backToMarketplace")}</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
