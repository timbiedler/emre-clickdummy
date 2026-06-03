"use client";

import { ArrowRight, Languages } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { translationExamples } from "@/data/translation-examples";
import { getLanguageLabel } from "@/lib/i18n";
import { useUi } from "@/lib/ui-i18n";

export function TranslationExamplesPanel() {
  const { t } = useUi();

  const titles: Record<string, string> = {
    "ex-1": t("translation.supplierZhDe"),
    "ex-2": t("translation.supplierDeEn"),
    "ex-3": t("translation.rfqDeEn"),
    "ex-4": t("translation.offerEnDe"),
  };

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Languages className="size-5 text-blue-600" />
        <p className="text-sm font-semibold text-slate-900">{t("translation.examples")}</p>
      </div>
      <div className="space-y-4">
        {translationExamples.map((ex) => (
          <div key={ex.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
            <p className="text-xs font-medium text-slate-500">{titles[ex.id]}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-3 text-sm">
                <p className="text-[10px] uppercase text-slate-400 mb-1">
                  {t("common.sourceLanguage")}: {getLanguageLabel(ex.sourceLang)}
                </p>
                <p className="text-slate-800">{ex.sourceText}</p>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-sm relative">
                <ArrowRight className="absolute -left-3 top-1/2 -translate-y-1/2 size-4 text-blue-400 hidden md:block" />
                <p className="text-[10px] uppercase text-blue-600 mb-1">
                  {t("common.targetLanguage")}: {getLanguageLabel(ex.targetLang)}
                </p>
                <p className="text-slate-900">{ex.translatedText}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={ex.status === "verified" ? "success" : "info"}>
                {ex.status === "verified" ? t("common.verified") : t("common.autoTranslated")}
              </StatusBadge>
              <span className="text-xs text-slate-500">{t("translation.multilingualReady")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
