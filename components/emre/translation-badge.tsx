"use client";

import { Languages } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { Language, TranslationStatus } from "@/data/types";
import { LANGUAGES } from "@/data/constants";
import { useApp } from "@/context/app-context";
import { getLanguageLabel } from "@/lib/i18n";
import { useUi } from "@/lib/ui-i18n";

const statusVariant: Record<
  TranslationStatus,
  { labelKey: string; variant: "success" | "warning" | "info" | "danger" }
> = {
  verified: { labelKey: "common.verified", variant: "success" },
  pending: { labelKey: "common.pending", variant: "warning" },
  auto: { labelKey: "common.autoTranslated", variant: "info" },
  missing: { labelKey: "common.missing", variant: "danger" },
};

export function TranslationBadge({
  status,
  showPanel = false,
  sourceText,
  translatedText,
  sourceLang = "en",
  targetLang,
}: {
  status: TranslationStatus;
  showPanel?: boolean;
  sourceText?: string;
  translatedText?: string;
  sourceLang?: Language;
  targetLang?: Language;
}) {
  const { language } = useApp();
  const { t } = useUi();
  const info = statusVariant[status];
  const target = targetLang ?? language;
  const sourceLabel = getLanguageLabel(sourceLang);
  const targetLabel = getLanguageLabel(target);

  return (
    <div className="space-y-2">
      <StatusBadge variant={info.variant}>
        <Languages className="mr-1 size-3" />
        {t(info.labelKey)} · {targetLabel}
      </StatusBadge>
      {showPanel && sourceText && (
        <div className="surface-card rounded-lg p-3 text-xs space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("common.sourceLanguage")}: {sourceLabel}</span>
            <span>{t("common.targetLanguage")}: {targetLabel}</span>
          </div>
          <div className="rounded-md bg-slate-50 p-2">
            <p className="text-slate-700">{sourceText}</p>
          </div>
          {translatedText && (
            <div className="rounded-md bg-blue-50 p-2">
              <p className="text-slate-900">{translatedText}</p>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge variant={info.variant}>{t(info.labelKey)}</StatusBadge>
            <span className="text-muted-foreground">{t("translation.multilingualReady")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
