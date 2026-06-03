"use client";

import { CheckCircle2, Circle, Upload, Globe, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { StatusBadge } from "@/components/emre/status-badge";
import { TranslationBadge } from "@/components/emre/translation-badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const checklist = [
  "Company profile completed",
  "Product catalog uploaded",
  "Price lists configured",
  "Stock feed connected",
  "Compliance documents verified",
  "Sales channel eligibility confirmed",
  "Multilingual content translated",
  "Platform approval received",
];

export default function SupplierPortalPage() {
  const completedSteps = 6;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Portal"
        description="Onboarding workflow, product management, RFQ inbox, and sales channel eligibility."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">Onboarding Progress</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold neon-text-green">
              {Math.round((completedSteps / checklist.length) * 100)}%
            </span>
            <Progress value={(completedSteps / checklist.length) * 100} className="flex-1" />
          </div>
          <div className="space-y-2">
            {checklist.map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                {i < completedSteps ? (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" />
                )}
                <span className={i < completedSteps ? "" : "text-muted-foreground"}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <ScoreCard label="Product Readiness" value={87} />
            <ScoreCard label="Compliance Score" value={94} />
            <ScoreCard label="Translation Status" value={72} />
          </div>

          <Tabs defaultValue="products">
            <TabsList className="glass-panel border-white/10">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="rfq">RFQ Inbox</TabsTrigger>
              <TabsTrigger value="channels">Sales Channels</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-4 glass-panel rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Product Upload</p>
                <Button size="sm" className="gap-2"><Upload className="size-4" /> Upload Products</Button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="glass-panel rounded-lg p-3">
                  <p className="text-xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Listed</p>
                </div>
                <div className="glass-panel rounded-lg p-3">
                  <p className="text-xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
                <div className="glass-panel rounded-lg p-3">
                  <p className="text-xl font-bold">Live</p>
                  <p className="text-xs text-muted-foreground">Stock Feed</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rfq" className="mt-4 space-y-2">
              {["RFQ-001 — 500k nitrile gloves", "RFQ-003 — Lab consumables", "RFQ-007 — Patient monitors"].map((r) => (
                <div key={r} className="glass-panel rounded-lg p-3 flex items-center justify-between text-sm">
                  <span>{r}</span>
                  <StatusBadge variant="info">New</StatusBadge>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="channels" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {["Hospitals", "Care Homes", "Laboratories", "Public Sector", "Distributors"].map((c) => (
                  <StatusBadge key={c} variant="success">{c}</StatusBadge>
                ))}
              </div>
              <TranslationBadge status="pending" showPanel sourceText="Product listing translation in progress" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
        <Globe className="size-8 text-cyan-400" />
        <div className="flex-1">
          <p className="font-medium">EU Market Expansion</p>
          <p className="text-sm text-muted-foreground">Your products are eligible for 8 EU markets and 6 languages.</p>
        </div>
        <BarChart3 className="size-6 text-violet-400" />
      </div>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-panel rounded-xl p-4 text-center">
      <p className="text-2xl font-bold neon-text-cyan">{value}%</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
