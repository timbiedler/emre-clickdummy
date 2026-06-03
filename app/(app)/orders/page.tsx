"use client";

import { useState } from "react";
import { RotateCcw, Wrench } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { OrderTrackingTimeline } from "@/components/emre/order-tracking-timeline";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { orders } from "@/data/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

const statusVariant = {
  processing: "warning" as const,
  confirmed: "info" as const,
  shipped: "info" as const,
  partial: "warning" as const,
  delivered: "success" as const,
};

export default function OrdersPage() {
  const { vertical } = useApp();
  const [selected, setSelected] = useState<Order | null>(null);
  const verticalOrders = orders.filter((o) => o.vertical === vertical);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders & Tracking"
        description="Order management, carrier tracking, delivery status, and reorder workflows."
      />

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground text-left">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Carrier</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">ETA</th>
              <th className="p-4 font-medium">Country</th>
            </tr>
          </thead>
          <tbody>
            {verticalOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="p-4 font-mono">{order.id.toUpperCase()}</td>
                <td className="p-4">
                  <StatusBadge variant={statusVariant[order.status]}>
                    {order.status}
                  </StatusBadge>
                </td>
                <td className="p-4">
                  <StatusBadge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                    {order.paymentStatus}
                  </StatusBadge>
                </td>
                <td className="p-4">{order.carrier}</td>
                <td className="p-4 font-semibold">{formatCurrency(order.amount)}</td>
                <td className="p-4">{formatDate(order.eta)}</td>
                <td className="p-4">{order.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="glass-panel-strong border-white/10">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.id.toUpperCase()}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <OrderTrackingTimeline order={selected} />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="glass-panel rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-medium">{selected.items}</p>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-medium">{formatCurrency(selected.amount)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/finance">
                    <Button size="sm" variant="outline">View Invoice</Button>
                  </Link>
                  <Button size="sm" variant="outline" className="gap-1">
                    <RotateCcw className="size-3" /> Reorder
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Wrench className="size-3" /> Return / Service
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
