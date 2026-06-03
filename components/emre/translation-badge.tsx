"use client";

import { Languages } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { TranslationStatus } from "@/data/types";
import { LANGUAGES } from "@/data/constants";
import { useApp } from "@/context/app-context";

const statusMap: Record<
  TranslationStatus,
  { label: string; variant: "success" | "warning" | "info" | "danger" }
> = {
  verified: { label: "Verified", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  auto: { label: "Auto-translated", variant: "info" },
  missing: { label: "Missing", variant: "danger" },
};

export function TranslationBadge({
  status,
  showPanel = false,
  sourceText,
}: {
  status: TranslationStatus;
  showPanel?: boolean;
  sourceText?: string;
}) {
  const { language } = useApp();
  const info = statusMap[status];
  const langLabel = LANGUAGES.find((l) => l.code === language)?.label ?? "English";

  return (
    <div className="space-y-2">
      <StatusBadge variant={info.variant}>
        <Languages className="mr-1 size-3" />
        {info.label} · {langLabel}
      </StatusBadge>
      {showPanel && sourceText && (
        <div className="glass-panel rounded-lg p-3 text-xs space-y-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Source: English</span>
            <span>Target: {langLabel}</span>
          </div>
          <p className="text-foreground/80">{sourceText}</p>
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge variant={info.variant}>{info.label}</StatusBadge>
            <span className="text-muted-foreground">Multilingual offer ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
