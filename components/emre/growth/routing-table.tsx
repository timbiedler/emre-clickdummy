"use client";

import { useState } from "react";
import { growthRoutingRows } from "@/data/growth";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/ui-i18n";
import { useGrowthActions } from "./growth-actions";

export function RoutingTablePanel() {
  const { t, countryName } = useUi();
  const { goToRfq, goToOffers } = useGrowthActions();
  const [rows, setRows] = useState(growthRoutingRows);
  const [notice, setNotice] = useState<string | null>(null);

  const reassign = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              partner: "Reassigned — EuroRobotics Dealers",
              lastAction: "Partner notified",
            }
          : r
      )
    );
    setNotice(t("growth.routing.reassigned"));
  };

  return (
    <div className="space-y-3">
      {notice && (
        <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{notice}</p>
      )}
      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-2">{t("growth.routing.company")}</th>
              <th className="px-4 py-2">{t("growth.routing.country")}</th>
              <th className="px-4 py-2">{t("growth.routing.partner")}</th>
              <th className="px-4 py-2">{t("growth.routing.status")}</th>
              <th className="px-4 py-2">{t("growth.routing.lastAction")}</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{row.company}</td>
                <td className="px-4 py-3">{countryName(row.country)}</td>
                <td className="px-4 py-3 text-xs max-w-[160px] truncate">{row.partner}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant="info">{row.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{row.lastAction}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => reassign(row.id)}>
                      {t("growth.routing.reassign")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setNotice(t("growth.routing.taskCreated"))}
                    >
                      {t("growth.routing.task")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => goToRfq()}>
                      RFQ
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => goToOffers()}>
                      {t("growth.routing.offer")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
