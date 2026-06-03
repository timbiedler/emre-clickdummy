"use client";

import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

const medicalFlow = [
  "Manufacturer",
  "Supplier Network",
  "EMRE",
  "RFQ / Offer Engine",
  "Hospitals / Care / Labs",
];

const roboticsFlow = [
  "Manufacturer",
  "EMRE",
  "Dealer Network",
  "Showroom",
  "End Customer",
  "Service Network",
  "Spare Parts",
];

export function FlowDiagram({ className }: { className?: string }) {
  const { vertical } = useApp();
  const steps = vertical === "medical" ? medicalFlow : roboticsFlow;

  return (
    <div className={cn("glass-panel rounded-xl p-5", className)}>
      <p className="text-sm font-medium mb-4">
        {vertical === "medical" ? "Medical Supply Flow" : "Robotics Distribution Flow"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium",
                step === "EMRE"
                  ? "bg-cyan-500/20 text-cyan-300 neon-border"
                  : "bg-white/5 text-foreground/80"
              )}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
