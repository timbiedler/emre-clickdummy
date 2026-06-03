"use client";

import { useState } from "react";
import { growthSignals } from "@/data/growth";
import type { GrowthSignal } from "@/data/growth-types";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";
import { Sparkles } from "lucide-react";

export function SignalDetectionPanel() {
  const { t, countryName } = useUi();
  const { goToSourcing } = useGrowthActions();
  const [selected, setSelected] = useState<GrowthSignal | null>(growthSignals[0] ?? null);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 max-h-[680px] overflow-y-auto">
        {growthSignals.map((sig) => (
          <button
            key={sig.id}
            type="button"
            onClick={() => setSelected(sig)}
            className={`surface-card rounded-xl p-4 text-left hover:border-blue-200 transition-colors ${selected?.id === sig.id ? "ring-2 ring-blue-200" : ""}`}
          >
            <div className="flex justify-between gap-2">
              <p className="font-semibold text-sm text-slate-900">{sig.title}</p>
              <StatusBadge variant={sig.confidence >= 85 ? "success" : "info"}>
                {sig.confidence}%
              </StatusBadge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {sig.company} · {countryName(sig.country)} · {sig.detectedAt}
            </p>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{sig.outreachAngle}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <StatusBadge variant="default">{t(`growth.signalType.${sig.type}`)}</StatusBadge>
              <StatusBadge variant="info">{sig.vertical}</StatusBadge>
            </div>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="surface-card rounded-xl p-5 border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white">
          <div className="flex items-center gap-2 text-violet-700 mb-3">
            <Sparkles className="size-4" />
            <p className="text-sm font-semibold">{t("growth.signals.aiPanel")}</p>
          </div>
          {selected ? (
            <p className="text-sm text-slate-700 leading-relaxed">{selected.aiRecommendation}</p>
          ) : (
            <p className="text-sm text-slate-500">{t("growth.signals.selectHint")}</p>
          )}
        </div>
        {selected && (
          <div className="surface-card rounded-xl p-5 space-y-3 text-sm">
            <p>
              <span className="text-slate-500">{t("growth.signals.products")}:</span>{" "}
              {selected.products.join(", ")}
            </p>
            <p>
              <span className="text-slate-500">{t("growth.signals.offer")}:</span> {selected.suggestedOffer}
            </p>
            <p>
              <span className="text-slate-500">{t("growth.signals.partner")}:</span> {selected.partner}
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => goToSourcing("signal-detection", selected.id)}
            >
              {t("growth.convertSourcing")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
