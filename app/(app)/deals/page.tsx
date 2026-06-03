"use client";

import { Clock, Tag } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { deals } from "@/data/deals";
import { t } from "@/lib/i18n";
import { daysUntil } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function DealsPage() {
  const { vertical, language } = useApp();
  const verticalDeals = deals.filter((d) => d.vertical === vertical);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description="Limited availability offers, volume discounts, bundle promotions, and leasing specials from verified suppliers."
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {verticalDeals.map((deal) => {
          const days = daysUntil(deal.validUntil);
          return (
            <div
              key={deal.id}
              className="glass-panel rounded-xl p-5 space-y-4 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <StatusBadge variant="success">{deal.discount}% off</StatusBadge>
                <StatusBadge variant="info">{deal.type}</StatusBadge>
              </div>
              <h3 className="font-semibold group-hover:text-cyan-300 transition-colors">
                {t(deal.title, language)}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                Valid {days} days · until {deal.validUntil}
              </div>
              {deal.limitedStock && (
                <StatusBadge variant="warning">Only {deal.limitedStock} units left</StatusBadge>
              )}
              <Button className="w-full gap-2 bg-gradient-to-r from-cyan-600/80 to-violet-600/80">
                <Tag className="size-4" /> Request Deal
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
