import { CheckCircle2, Circle, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/data/types";

const steps = [
  { key: "processing", label: "Processing", icon: Circle },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

const statusOrder = ["processing", "confirmed", "shipped", "partial", "delivered"];

export function OrderTrackingTimeline({ order }: { order: Order }) {
  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-bold",
            order.carrier === "DHL" && "bg-yellow-500/20 text-yellow-400",
            order.carrier === "DPD" && "bg-red-500/20 text-red-400",
            order.carrier === "UPS" && "bg-amber-700/20 text-amber-500",
            order.carrier === "FedEx" && "bg-purple-500/20 text-purple-400"
          )}
        >
          {order.carrier}
        </span>
        <span className="text-sm font-mono text-muted-foreground">
          {order.trackingNumber}
        </span>
      </div>
      <div className="relative">
        {steps.map((step, i) => {
          const done = currentIdx >= statusOrder.indexOf(step.key);
          const active = statusOrder.indexOf(order.status) === statusOrder.indexOf(step.key);
          return (
            <div key={step.key} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "rounded-full p-1.5",
                    done
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-white/5 text-muted-foreground"
                  )}
                >
                  <step.icon className="size-4" />
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-8 mt-1",
                      done ? "bg-cyan-500/40" : "bg-white/10"
                    )}
                  />
                )}
              </div>
              <div className={cn("pt-0.5", active && "text-cyan-300")}>
                <p className="text-sm font-medium">{step.label}</p>
                {active && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ETA: {order.eta}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
