"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  growthEmailSequences,
  growthGoogleAdDrafts,
  growthPartnerTasks,
} from "@/data/growth";
import { StatusBadge } from "@/components/emre/status-badge";
import { useUi } from "@/lib/ui-i18n";
import type { OutreachChannel } from "@/data/growth-types";

const channels: OutreachChannel[] = [
  "email",
  "google_ads",
  "landingpage",
  "sales_partner",
  "qr_nfc",
  "showroom",
  "api_webhook",
];

export function OutreachCockpitPanel() {
  const { t, countryName } = useUi();
  const [channel, setChannel] = useState<OutreachChannel | "all">("all");

  const consentVariant = (c: string) =>
    c === "opted_out" ? "warning" : c === "opted_in" ? "success" : "info";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setChannel("all")}
          className={`px-3 py-1.5 text-xs rounded-lg border ${channel === "all" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-slate-200"}`}
        >
          {t("common.all")}
        </button>
        {channels.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => setChannel(ch)}
            className={`px-3 py-1.5 text-xs rounded-lg border ${channel === ch ? "bg-blue-50 border-blue-200 text-blue-700" : "border-slate-200"}`}
          >
            {t(`growth.outreach.channel.${ch}`)}
          </button>
        ))}
      </div>

      {(channel === "all" || channel === "email") && (
        <Section title={t("growth.outreach.email")} count={growthEmailSequences.length}>
          <div className="divide-y divide-slate-100">
            {growthEmailSequences.slice(0, 8).map((e) => (
              <div key={e.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-slate-500">
                    {e.steps} steps · {countryName(e.territory)}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-slate-500">
                    {e.openRate}% / {e.replyRate}%
                  </span>
                  <StatusBadge variant={consentVariant(e.consent)}>{e.consent}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {(channel === "all" || channel === "google_ads") && (
        <Section title={t("growth.outreach.googleAds")} count={growthGoogleAdDrafts.length}>
          {growthGoogleAdDrafts.map((g) => (
            <div key={g.id} className="py-3 border-b border-slate-100 last:border-0 text-sm">
              <p className="font-medium">{g.campaignName}</p>
              <p className="text-xs text-slate-600 mt-1">{g.headline}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge variant="info">€{g.budgetDaily}/day</StatusBadge>
                <StatusBadge variant={consentVariant(g.consent)}>{g.consent}</StatusBadge>
              </div>
            </div>
          ))}
        </Section>
      )}

      {(channel === "all" || channel === "sales_partner") && (
        <Section title={t("growth.outreach.partnerTasks")} count={growthPartnerTasks.length}>
          <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
            {growthPartnerTasks.slice(0, 12).map((task) => (
              <div key={task.id} className="py-2.5 text-sm flex justify-between gap-2">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-xs text-slate-500">
                    {task.partner} · {task.dueDate}
                  </p>
                </div>
                <StatusBadge variant={task.priority === "high" ? "warning" : "default"}>
                  {task.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Section>
      )}

      {channel !== "all" &&
        !["email", "google_ads", "sales_partner"].includes(channel) && (
          <p className="text-sm text-slate-500 surface-card rounded-xl p-6">
            {t("growth.outreach.channelPlaceholder")}: {t(`growth.outreach.channel.${channel}`)}
          </p>
        )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="surface-card rounded-xl p-5">
      <p className="text-sm font-semibold mb-3">
        {title} <span className="text-slate-400 font-normal">({count})</span>
      </p>
      {children}
    </div>
  );
}
