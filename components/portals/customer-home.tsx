"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  CreditCard,
  Sparkles,
  Store,
  Globe,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { ActionCard } from "@/components/emre/action-card";
import { CommandCenterFlow } from "@/components/emre/command-center-flow";
import { IndustryProfileCard } from "@/components/emre/industry-profile-card";
import { ProductCard } from "@/components/emre/product-card";
import { useApp } from "@/context/app-context";
import { useRfq } from "@/context/rfq-context";
import { getAllProducts, rfqs, orders } from "@/data";
import { getRfqTemplatesForIndustry } from "@/data/industry-content";
import {
  getRecommendedCategories,
  sortProductsByRelevance,
} from "@/lib/industry-relevance";
import { useUi } from "@/lib/ui-i18n";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CustomerHomePage() {
  const router = useRouter();
  const { t } = useUi();
  const { vertical, industry, showRelevantFirst, openConsultation } = useApp();
  const { openCreateRfq } = useRfq();
  const openRfqs = rfqs.filter((r) => r.status !== "closed").length;
  const inTransit = orders.filter((o) => o.status === "shipped" || o.status === "partial").length;
  const productCount = getAllProducts().filter((p) => p.vertical === vertical).length;
  const templates = getRfqTemplatesForIndustry(industry).slice(0, 3);
  const categories = getRecommendedCategories(industry, vertical).slice(0, 6);

  const recommended = sortProductsByRelevance(
    getAllProducts().filter((p) => p.vertical === vertical),
    industry,
    showRelevantFirst
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="nav.dashboard"
        descriptionKey="dashboard.aiRecommendations"
        action={
          <Link href="/assistant">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Sparkles className="size-4" /> {t("nav.aiAssistant")}
            </Button>
          </Link>
        }
      />

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
          value={openRfqs}
          change={12.4}
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
          value="Pre-approved"
          icon={CreditCard}
          accent="violet"
          onClick={() => router.push("/finance")}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            title={t("nav.marketplace")}
            description={t("marketplace.subtitle")}
            href="/marketplace"
            icon={Store}
          />
          <ActionCard
            title={t("nav.aiAssistant")}
            description={t("nav.aiAssistant")}
            href="/assistant"
            icon={Sparkles}
          />
          <ActionCard
            title={t("nav.leasingFinance")}
            description={t("nav.leasingFinance")}
            href="/finance"
            icon={CreditCard}
          />
          <ActionCard
            title={t("nav.networkMap")}
            description={t("networkMap.subtitle")}
            href="/network-map"
            icon={Globe}
          />
          <ActionCard
            title={t("nav.serviceNetwork")}
            description={t("service.subtitle")}
            href="/service-network"
            icon={Wrench}
          />
          <ActionCard
            title={t("nav.rfqCenter")}
            description={t("rfq.subtitle")}
            href="/rfq"
            secondaryHref="/offers"
            secondaryLabel={t("nav.offers")}
            icon={FileText}
          />
        </div>
        <IndustryProfileCard />
      </div>

      <div className="surface-card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">{t("dashboard.recommendedCategories")}</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href="/marketplace"
              className="text-xs rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50 text-slate-700"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-900">{t("dashboard.recommendedProducts")}</p>
          <Link href="/marketplace" className="text-xs text-blue-600 hover:underline">
            {t("nav.marketplace")}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => openConsultation(p.id)} />
          ))}
        </div>
      </div>

      <div className="surface-card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">{t("dashboard.rfqTemplates")}</p>
        <div className="grid md:grid-cols-3 gap-3">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() =>
                openCreateRfq({
                  source: "generic",
                  vertical,
                  category: tmpl.categories[0],
                  useCase: tmpl.description,
                  industry,
                })
              }
              className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 text-left w-full"
            >
              <p className="text-sm font-medium text-slate-900">{tmpl.title}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
