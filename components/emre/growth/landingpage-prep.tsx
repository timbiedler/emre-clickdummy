"use client";

import { useState } from "react";
import { growthLandingpages } from "@/data/growth";
import type { GrowthLandingpage } from "@/data/growth-types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/emre/status-badge";
import { useUi } from "@/lib/ui-i18n";
import { Eye } from "lucide-react";

export function LandingpagePrepPanel() {
  const { t } = useUi();
  const [preview, setPreview] = useState<GrowthLandingpage | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {growthLandingpages.map((lp) => (
          <div key={lp.id} className="surface-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{lp.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{lp.type}</p>
              </div>
              <StatusBadge variant={lp.status === "ready" ? "success" : "info"}>{lp.status}</StatusBadge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["copy", "seo", "assets", "compliance"] as const).map((k) => (
                <div key={k} className="rounded bg-slate-50 px-2 py-1.5">
                  <span className="text-slate-500">{t(`growth.landing.${k}`)}</span>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${lp.readiness[k]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{lp.aiHeadline}</p>
            <Button size="sm" variant="outline" className="w-full" onClick={() => setPreview(lp)}>
              <Eye className="size-3.5 mr-1.5" />
              {t("growth.landing.preview")}
            </Button>
          </div>
        ))}
      </div>
      {preview && (
        <div className="surface-card rounded-xl p-6 border-2 border-dashed border-blue-200 bg-gradient-to-b from-white to-blue-50/30">
          <p className="text-xs text-blue-600 font-medium mb-2">{t("growth.landing.previewCard")}</p>
          <h2 className="text-xl font-semibold text-slate-900">{preview.aiHeadline}</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-xl">{preview.aiSubcopy}</p>
          <Button size="sm" variant="ghost" className="mt-4" onClick={() => setPreview(null)}>
            {t("common.cancel")}
          </Button>
        </div>
      )}
    </div>
  );
}
