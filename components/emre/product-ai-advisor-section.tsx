"use client";

import { Sparkles, MessageSquare, Users, TrendingUp, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { useApp } from "@/context/app-context";
import { t } from "@/lib/i18n";
import { getProductAiAdvisor } from "@/lib/product-ai";
import { getProducts } from "@/data";
import type { Product } from "@/data/types";

export function ProductAiAdvisorSection({ product }: { product: Product }) {
  const { language, openConsultation } = useApp();
  const advisor = getProductAiAdvisor(product);
  const allProducts = getProducts(product.vertical);
  const alternatives = advisor.alternativeIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div className="surface-card rounded-xl p-4 space-y-4 border border-violet-200">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-violet-600" />
        <h3 className="text-sm font-semibold">AI Sales Advisor</h3>
        <StatusBadge variant="violet">AI Advisor</StatusBadge>
      </div>

      <div className="surface-card rounded-lg p-3 space-y-1">
        <p className="text-xs font-medium text-violet-600 uppercase">AI Product Summary</p>
        <p className="text-sm">{t(product.aiSummary, language)}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <AdvisorBlock
          icon={Users}
          title="Recommended Buyer Types"
          items={advisor.recommendedBuyerTypes}
        />
        <AdvisorBlock
          icon={TrendingUp}
          title="Recommended Sales Channels"
          items={advisor.recommendedSalesChannels}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <InfoTile label="ROI / Savings Estimate" value={advisor.roiEstimate} />
        <InfoTile label="Budget Fit" value={advisor.budgetFit} />
        <InfoTile label="Leasing Recommendation" value={advisor.leasingRecommendation} />
        <InfoTile label="Service Recommendation" value={advisor.serviceRecommendation} />
      </div>

      {alternatives.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2 flex items-center gap-1">
            <GitCompare className="size-3" /> Alternatives & Cross-sell
          </p>
          <div className="space-y-1.5">
            {alternatives.map((alt) => (
              <div key={alt.id} className="surface-card rounded-lg px-3 py-2 text-xs">
                {t(alt.name, language)} · {alt.brand}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="gap-2 bg-violet-600 hover:bg-violet-500"
          onClick={() => openConsultation(product.id)}
        >
          <Sparkles className="size-4" /> Ask AI Advisor
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => openConsultation(product.id)}
        >
          <MessageSquare className="size-4" /> Get Consultation
        </Button>
      </div>
    </div>
  );
}

function AdvisorBlock({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Users;
  title: string;
  items: string[];
}) {
  return (
    <div className="surface-card rounded-lg p-3 space-y-2">
      <p className="text-xs font-medium flex items-center gap-1 text-blue-600">
        <Icon className="size-3" /> {title}
      </p>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <StatusBadge key={item} variant="default">
            {item}
          </StatusBadge>
        ))}
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-lg p-3">
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-xs mt-1 leading-relaxed">{value}</p>
    </div>
  );
}
