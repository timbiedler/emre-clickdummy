"use client";

import { countryMarketStats } from "@/data/eu-regions";
import { useUi } from "@/lib/ui-i18n";
import { StatusBadge } from "@/components/emre/status-badge";

const statusVariant = {
  top: "success" as const,
  growing: "info" as const,
  underserved: "warning" as const,
  stable: "default" as const,
};

export function CountryPerformancePanel({
  coverageMode = "all",
}: {
  coverageMode?: "all" | "sales_partner" | "service" | "finance" | "expansion";
}) {
  const { t, countryName } = useUi();

  const sorted = [...countryMarketStats].sort((a, b) => {
    if (coverageMode === "sales_partner") return b.salesPartnerCount - a.salesPartnerCount;
    if (coverageMode === "service") return b.serviceCoverage - a.serviceCoverage;
    if (coverageMode === "finance") return b.financeCoverage - a.financeCoverage;
    if (coverageMode === "expansion") return b.expansionScore - a.expansionScore;
    return b.rfqVolume - a.rfqVolume;
  });

  const title =
    coverageMode === "sales_partner"
      ? t("networkMap.salesPartnerCoverage")
      : coverageMode === "service"
        ? t("networkMap.serviceCoverageByCountry")
        : coverageMode === "finance"
          ? t("networkMap.financeCoverageByCountry")
          : coverageMode === "expansion"
            ? t("networkMap.expansionOpportunities")
            : t("networkMap.countryPerformance");

  return (
    <div className="surface-card p-5 space-y-4 h-fit max-h-[520px] overflow-y-auto">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="space-y-2">
        {sorted.slice(0, 12).map((s) => {
          const metric =
            coverageMode === "sales_partner"
              ? `${s.salesPartnerCount} partners`
              : coverageMode === "service"
                ? `${s.serviceCoverage}%`
                : coverageMode === "finance"
                  ? `${s.financeCoverage}%`
                  : coverageMode === "expansion"
                    ? `Score ${s.expansionScore}`
                    : `${s.rfqVolume} RFQs`;

          return (
            <div
              key={s.country}
              className="rounded-lg border border-slate-200 bg-white p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{countryName(s.country)}</p>
                <StatusBadge variant={statusVariant[s.status]}>{s.status}</StatusBadge>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{t(`regions.${s.region}`)}</span>
                <span>{metric}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${
                      coverageMode === "service"
                        ? s.serviceCoverage
                        : coverageMode === "finance"
                          ? s.financeCoverage
                          : s.expansionScore
                    }%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
