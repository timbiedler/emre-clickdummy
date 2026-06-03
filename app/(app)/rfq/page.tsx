"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { RFQCard } from "@/components/emre/rfq-card";
import { RFQDetailDrawer } from "@/components/emre/rfq-detail-drawer";
import { useApp } from "@/context/app-context";
import { rfqs } from "@/data";
import type { RFQ } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RFQPage() {
  const { vertical } = useApp();
  const [selected, setSelected] = useState<RFQ | null>(null);
  const verticalRfqs = rfqs.filter((r) => r.vertical === vertical);

  const tabs = [
    { id: "all", label: "All RFQs", filter: () => true },
    { id: "active", label: "Active", filter: (r: RFQ) => r.status === "active" },
    { id: "matching", label: "Matching", filter: (r: RFQ) => r.status === "matching" },
    { id: "offers", label: "Offers Received", filter: (r: RFQ) => r.status === "offers_received" },
    { id: "draft", label: "Drafts", filter: (r: RFQ) => r.status === "draft" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFQ Center"
        description="Manage requests for quotation, supplier matching, offer comparison, and multilingual communication."
        action={
          <Button className="gap-2 bg-cyan-600 hover:bg-cyan-500">
            <Plus className="size-4" /> Create RFQ
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList className="glass-panel border-white/10">
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label} ({verticalRfqs.filter(t.filter).length})
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="mt-4">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {verticalRfqs.filter(t.filter).map((rfq) => (
                <RFQCard key={rfq.id} rfq={rfq} onClick={() => setSelected(rfq)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <RFQDetailDrawer rfq={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
