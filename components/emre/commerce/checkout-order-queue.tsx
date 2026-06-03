"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/emre/status-badge";
import { useCommerce } from "@/context/commerce-context";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function CheckoutOrderQueue({ title = "Recent checkout orders" }: { title?: string }) {
  const { placedOrders } = useCommerce();

  if (placedOrders.length === 0) {
    return (
      <div className="surface-card rounded-xl p-5 text-sm text-slate-500">
        {title} — no checkout orders yet (complete a checkout to see queue).
      </div>
    );
  }

  return (
    <div className="surface-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">All orders</Link>
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="p-3 font-medium">Order</th>
            <th className="p-3 font-medium">Product</th>
            <th className="p-3 font-medium">Payment</th>
            <th className="p-3 font-medium">Finance</th>
            <th className="p-3 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {placedOrders.slice(0, 8).map(({ order }) => (
            <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="p-3 font-mono text-xs">{order.id.toUpperCase()}</td>
              <td className="p-3">{order.productName ?? "—"}</td>
              <td className="p-3 capitalize">{order.paymentMethod ?? order.paymentStatus}</td>
              <td className="p-3">
                <StatusBadge variant={order.financeStatus ? "warning" : "default"}>
                  {order.financeStatus ?? order.documentStatus ?? "—"}
                </StatusBadge>
              </td>
              <td className="p-3">{formatCurrency(order.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
