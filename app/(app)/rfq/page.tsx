"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { RFQCard } from "@/components/emre/rfq-card";
import { RFQDetailDrawer } from "@/components/emre/rfq-detail-drawer";
import { useApp } from "@/context/app-context";
import { rfqs } from "@/data";
import type { RFQ } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUi } from "@/lib/ui-i18n";

export default function RFQPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <RFQPageContent />
    </Suspense>
  );
}

function RFQPageContent() {
  const searchParams = useSearchParams();
  const { vertical } = useApp();
  const { t } = useUi();
  const [selected, setSelected] = useState<RFQ | null>(null);
  const verticalRfqs = rfqs.filter((r) => r.vertical === vertical);

  const rfqFromUrl = useMemo(() => {
    const rfqId = searchParams.get("rfqId");
    return rfqId ? rfqs.find((r) => r.id === rfqId) ?? null : null;
  }, [searchParams]);
  const activeRfq = selected ?? rfqFromUrl;

  const tabs = [
    { id: "all", labelKey: "rfq.allRfqs", filter: () => true },
    { id: "active", labelKey: "rfq.active", filter: (r: RFQ) => r.status === "active" },
    { id: "matching", labelKey: "rfq.matching", filter: (r: RFQ) => r.status === "matching" },
    {
      id: "offers",
      labelKey: "rfq.offersReceived",
      filter: (r: RFQ) => r.status === "offers_received",
    },
    { id: "draft", labelKey: "rfq.drafts", filter: (r: RFQ) => r.status === "draft" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="rfq.title"
        descriptionKey="rfq.subtitle"
        action={
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4" /> {t("rfq.createRfq")}
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList className="surface-card border-slate-200">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {t(tab.labelKey)} ({verticalRfqs.filter(tab.filter).length})
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {verticalRfqs.filter(tab.filter).map((rfq) => (
                <RFQCard key={rfq.id} rfq={rfq} onClick={() => setSelected(rfq)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <RFQDetailDrawer rfq={activeRfq} open={!!activeRfq} onClose={() => setSelected(null)} />
    </div>
  );
}
