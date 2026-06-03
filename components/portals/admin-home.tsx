"use client";

import {
  FileText,
  Package,
  CreditCard,
  Sparkles,
  Handshake,
  Store,
  Globe,
  Megaphone,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { ActionCard } from "@/components/emre/action-card";
import { CommandCenterFlow } from "@/components/emre/command-center-flow";
import { ActivityFeed } from "@/components/emre/activity-feed";
import { RFQCard } from "@/components/emre/rfq-card";
import { useApp } from "@/context/app-context";
import { adminActivities } from "@/data/admin-metrics";
import { getAllProducts, rfqs, orders, financeApplications } from "@/data";
import { salesPartnerApplications } from "@/data/sales-partners";
import { networkEntities } from "@/data/network-map";
import { growthCampaigns } from "@/data/growth-campaigns";
import { demandGaps } from "@/data/sourcing";
import { servicepoints } from "@/data/servicepoints";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUi } from "@/lib/ui-i18n";

export default function AdminHomePage() {
  const router = useRouter();
  const { t } = useUi();
  const { vertical } = useApp();

  const verticalRfqs = rfqs.filter(
    (r) => r.vertical === vertical && r.status !== "closed"
  );
  const activeRfqs = verticalRfqs.slice(0, 3);
  const inTransit = orders.filter(
    (o) => o.vertical === vertical && (o.status === "shipped" || o.status === "partial")
  ).length;
  const financeApps = financeApplications.filter((f) => f.vertical === vertical).length;
  const pendingPartners = salesPartnerApplications.filter(
    (a) => a.approvalStatus === "pending" || a.approvalStatus === "review"
  ).length;
  const productCount = getAllProducts().length;
  const networkCount = networkEntities.filter((e) => e.active).length;
  const gapCount = demandGaps.filter((d) => d.status === "open").length;
  const campaignCount = growthCampaigns.filter((c) => c.status === "active").length;
  const ticketCount = 12 + servicepoints.length;

  return (
    <div className="space-y-6">
      <PageHeader titleKey="nav.commandCenter" descriptionKey="rfq.subtitle" />

      <CommandCenterFlow />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("dashboard.kpi.products")}
          value={productCount}
          icon={Store}
          accent="blue"
          onClick={() => router.push("/marketplace")}
        />
        <MetricCard
          label={t("dashboard.kpi.rfqs")}
          value={verticalRfqs.length + 42}
          change={14.2}
          icon={FileText}
          accent="blue"
          onClick={() => router.push("/rfq")}
        />
        <MetricCard
          label={t("dashboard.kpi.orders")}
          value={inTransit}
          icon={Package}
          accent="green"
          onClick={() => router.push("/orders")}
        />
        <MetricCard
          label={t("dashboard.kpi.leasingPipeline")}
          value={financeApps + 8}
          change={18.6}
          icon={CreditCard}
          accent="violet"
          onClick={() => router.push("/finance")}
        />
        <MetricCard
          label={t("dashboard.kpi.networkCoverage")}
          value={networkCount}
          icon={Globe}
          accent="slate"
          onClick={() => router.push("/network-map")}
        />
        <MetricCard
          label={t("dashboard.kpi.demandGaps")}
          value={gapCount}
          icon={ClipboardList}
          accent="blue"
          onClick={() => router.push("/admin/sourcing-desk")}
        />
        <MetricCard
          label={t("dashboard.kpi.activeCampaigns")}
          value={campaignCount}
          icon={Megaphone}
          accent="green"
          onClick={() => router.push("/admin/growth")}
        />
        <MetricCard
          label={t("dashboard.kpi.serviceTickets")}
          value={ticketCount}
          icon={Wrench}
          accent="slate"
          onClick={() => router.push("/service-network")}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          title={t("nav.marketplace")}
          description={t("marketplace.subtitle")}
          href="/marketplace"
          icon={Store}
        />
        <ActionCard
          title={t("nav.growthTerritory")}
          description={t("growth.subtitle")}
          href="/admin/growth"
          icon={Megaphone}
        />
        <ActionCard
          title={t("nav.sourcingDesk")}
          description={t("sourcing.subtitle")}
          href="/admin/sourcing-desk"
          icon={ClipboardList}
        />
        <ActionCard
          title={t("nav.salesPartnerOnboarding")}
          description={`${pendingPartners} ${t("common.pending").toLowerCase()}`}
          href="/admin/sales-partners"
          icon={Handshake}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t("rfq.active")}</p>
            <Link href="/rfq" className="text-xs text-blue-600 hover:underline">
              {t("nav.rfqCenter")}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeRfqs.map((rfq) => (
              <RFQCard
                key={rfq.id}
                rfq={rfq}
                onClick={() => router.push(`/rfq?rfqId=${rfq.id}`)}
              />
            ))}
          </div>
        </div>
        <ActivityFeed items={adminActivities.slice(0, 8)} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/demo" className="surface-card p-5 hover:border-blue-200 transition-colors block">
          <p className="text-sm font-semibold text-slate-900">{t("nav.demo")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("demo.subtitle")}</p>
        </Link>
        <Link href="/admin/users" className="surface-card p-5 hover:border-blue-200 transition-colors block">
          <p className="text-sm font-semibold text-slate-900">{t("nav.usersRoles")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("growth.tabs.routing")}</p>
        </Link>
        <Link href="/assistant" className="surface-card p-5 hover:border-blue-200 transition-colors block">
          <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="size-4 text-violet-600" />
            {t("nav.aiAssistant")}
          </p>
          <p className="text-xs text-slate-500 mt-1">{t("assistant.subtitle")}</p>
        </Link>
      </div>
    </div>
  );
}
