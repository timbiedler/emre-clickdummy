"use client";

import { Shield, FileCheck, Star, Lock, CreditCard, Clock } from "lucide-react";
import { useUi } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

const BADGE_KEYS = [
  "trust.compliance",
  "trust.documents",
  "trust.supplierScore",
  "trust.secureUpload",
  "trust.payment",
  "trust.sla",
] as const;

const BADGE_ICONS = [Shield, FileCheck, Star, Lock, CreditCard, Clock];

export function TrustStrip({ className, compact }: { className?: string; compact?: boolean }) {
  const { t } = useUi();

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        compact ? "text-[10px]" : "text-xs",
        className
      )}
    >
      {BADGE_KEYS.map((key, i) => {
        const Icon = BADGE_ICONS[i];
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600"
          >
            <Icon className={cn(compact ? "size-3" : "size-3.5", "text-slate-400")} />
            {t(key)}
          </span>
        );
      })}
    </div>
  );
}
