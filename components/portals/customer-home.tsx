"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  CreditCard,
  Sparkles,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MetricCard } from "@/components/emre/metric-card";
import { IndustryProfileCard } from "@/components/emre/industry-profile-card";
import { ProductCard } from "@/components/emre/product-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { useRfq } from "@/context/rfq-context";
import { getAllProducts, rfqs, orders, deals } from "@/data";
import { getRfqTemplatesForIndustry } from "@/data/industry-content";
import { crossIndustryRecommendations } from "@/data/industry-content";
import {
  getRecommendedCategories,
  sortProductsByRelevance,
} from "@/lib/industry-relevance";
import { Button } from "@/components/ui/button";

export default function CustomerHomePage() {
  const { vertical, industry, showRelevantFirst, openConsultation } = useApp();
  const { openCreateRfq } = useRfq();
  const openRfqs = rfqs.filter((r) => r.status !== "closed").length;
  const inTransit = orders.filter((o) => o.status === "shipped" || o.status === "partial").length;
  const relevantDeals = deals.filter((d) => d.vertical === vertical).slice(0, 3);
  const templates = getRfqTemplatesForIndustry(industry).slice(0, 3);
  const categories = getRecommendedCategories(industry, vertical);

  const recommended = sortProductsByRelevance(
    getAllProducts(),
    industry,
    showRelevantFirst
  ).slice(0, 4);

  const crossRecs = crossIndustryRecommendations
    .filter((c) => c.industry === industry)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Industry-aware procurement overview with RFQs, orders, finance, and recommended products."
        action={
          <Link href="/assistant">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Sparkles className="size-4" /> AI Need Assistant
            </Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Open RFQs" value={openRfqs + 3} change={12.4} icon={FileText} accent="blue" />
          <MetricCard label="Orders in Transit" value={inTransit} icon={Package} accent="green" />
          <MetricCard label="Financing Status" value="Pre-approved" icon={CreditCard} accent="violet" />
          <MetricCard label="Industry Deals" value={relevantDeals.length + 5} icon={Tag} accent="green" />
        </div>
        <IndustryProfileCard />
      </div>

      <div className="surface-card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">Recommended categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c} href="/marketplace">
              <StatusBadge variant="info">{c}</StatusBadge>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-900">Recommended products</p>
          <Link href="/marketplace" className="text-xs text-blue-600 hover:underline">View marketplace</Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => openConsultation(p.id)} />
          ))}
        </div>
      </div>

      {crossRecs.length > 0 && (
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-slate-900 mb-3">Cross-industry recommendations</p>
          <div className="space-y-2">
            {crossRecs.map((c) => (
              <div key={c.productCategory} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
                <span className="text-slate-700">{c.productCategory}</span>
                <span className="text-slate-500 text-xs">{c.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface-card p-5">
        <p className="text-sm font-semibold text-slate-900 mb-3">RFQ templates for your industry</p>
        <div className="grid md:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                openCreateRfq({
                  source: "generic",
                  vertical,
                  category: t.categories[0],
                  useCase: t.description,
                  industry,
                })
              }
              className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 text-left w-full"
            >
              <p className="text-sm font-medium text-slate-900">{t.title}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
