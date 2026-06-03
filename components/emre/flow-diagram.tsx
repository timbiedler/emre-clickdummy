"use client";

import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

const medicalFlow = [
  "Manufacturer",
  "Supplier Network",
  "Distribution Engine",
  "RFQ / Offers",
  "Hospitals / Care / Labs",
];

const roboticsFlow = [
  "Manufacturer",
  "Distribution Engine",
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
    <div className={cn("surface-card rounded-xl p-5", className)}>
      <p className="text-sm font-medium text-slate-900 mb-4">
        {vertical === "medical" ? "Medical supply flow" : "Robotics distribution flow"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium border",
                step === "Distribution Engine"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              )}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="size-4 text-slate-400 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
