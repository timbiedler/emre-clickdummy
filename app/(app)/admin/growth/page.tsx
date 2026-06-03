"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/emre/app-shell";
import { TerritoryPanel } from "@/components/emre/growth/territory-panel";
import { LeadDiscoveryPanel } from "@/components/emre/growth/lead-discovery-panel";
import { SignalDetectionPanel } from "@/components/emre/growth/signal-card";
import { CampaignCalendar } from "@/components/emre/growth/campaign-calendar";
import { BundleBuilderPanel } from "@/components/emre/growth/bundle-builder";
import { LandingpagePrepPanel } from "@/components/emre/growth/landingpage-prep";
import { OutreachCockpitPanel } from "@/components/emre/growth/outreach-cockpit";
import { BudgetPlannerPanel } from "@/components/emre/growth/budget-planner";
import { RoutingTablePanel } from "@/components/emre/growth/routing-table";
import { PerformanceDashboard } from "@/components/emre/growth/performance-dashboard";
import { MetricCard } from "@/components/emre/metric-card";
import { growthLeads, growthSignals, growthCampaigns } from "@/data/growth";
import type { GrowthLead } from "@/data/growth-types";
import { LeadDrawer } from "@/components/emre/growth/lead-drawer";
import { useGrowthActions } from "@/components/emre/growth/growth-actions";
import { growthTerritories } from "@/data/growth-territories";
import { useUi } from "@/lib/ui-i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, Radio, Megaphone } from "lucide-react";

export default function GrowthTerritoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <GrowthTerritoryContent />
    </Suspense>
  );
}

function GrowthTerritoryContent() {
  const searchParams = useSearchParams();
  const { t } = useUi();
  const { goToRfq, goToFinance } = useGrowthActions();
  const [toast, setToast] = useState<string | null>(null);
  const [campaignLead, setCampaignLead] = useState<string | undefined>();
  const [tabOverride, setTabOverride] = useState<string | null>(null);
  const [leadOverride, setLeadOverride] = useState<GrowthLead | null>(null);

  const tabFromUrl = searchParams.get("tab");
  const leadFromUrl = useMemo(() => {
    const leadId = searchParams.get("leadId");
    return leadId ? growthLeads.find((l) => l.id === leadId) ?? null : null;
  }, [searchParams]);
  const campaignFromUrl = useMemo(() => {
    const campaignId = searchParams.get("campaignId");
    return campaignId ? growthCampaigns.find((c) => c.id === campaignId) ?? null : null;
  }, [searchParams]);

  const activeTab =
    tabOverride ?? tabFromUrl ?? (leadFromUrl ? "leads" : campaignFromUrl ? "campaigns" : "territory");
  const activeLead = leadOverride ?? leadFromUrl;
  const highlightCampaign = campaignFromUrl?.name ?? campaignLead;

  return (
    <div className="space-y-6">
      <PageHeader titleKey="growth.title" descriptionKey="growth.subtitle" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("growth.kpi.territories")}
          value={growthTerritories.length}
          icon={Globe}
          accent="blue"
        />
        <MetricCard
          label={t("growth.kpi.leads")}
          value={growthLeads.length}
          icon={Users}
          accent="green"
        />
        <MetricCard
          label={t("growth.kpi.signals")}
          value={growthSignals.length}
          icon={Radio}
          accent="violet"
        />
        <MetricCard
          label={t("growth.kpi.campaigns")}
          value={growthCampaigns.length}
          icon={Megaphone}
          accent="slate"
        />
      </div>

      {toast && (
        <div className="surface-card rounded-lg px-4 py-2 text-sm text-blue-700 border border-blue-100">
          {toast}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setTabOverride}>
        <TabsList className="surface-card border-slate-200 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="territory">{t("growth.tabs.territory")}</TabsTrigger>
          <TabsTrigger value="leads">{t("growth.tabs.leads")}</TabsTrigger>
          <TabsTrigger value="signals">{t("growth.tabs.signals")}</TabsTrigger>
          <TabsTrigger value="campaigns">{t("growth.tabs.campaigns")}</TabsTrigger>
          <TabsTrigger value="bundles">{t("growth.tabs.bundles")}</TabsTrigger>
          <TabsTrigger value="landing">{t("growth.tabs.landing")}</TabsTrigger>
          <TabsTrigger value="outreach">{t("growth.tabs.outreach")}</TabsTrigger>
          <TabsTrigger value="budget">{t("growth.tabs.budget")}</TabsTrigger>
          <TabsTrigger value="routing">{t("growth.tabs.routing")}</TabsTrigger>
          <TabsTrigger value="performance">{t("growth.tabs.performance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="territory" className="mt-4">
          <TerritoryPanel />
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          <LeadDiscoveryPanel
            onToast={setToast}
            onSelectCampaignLead={(l) => setCampaignLead(l.suggestedCampaign)}
          />
        </TabsContent>
        <TabsContent value="signals" className="mt-4">
          <SignalDetectionPanel />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-4">
          <CampaignCalendar
            highlightLeadCampaign={highlightCampaign}
            onCreateCampaign={() => setToast("Campaign draft created")}
          />
        </TabsContent>
        <TabsContent value="bundles" className="mt-4">
          <BundleBuilderPanel />
        </TabsContent>
        <TabsContent value="landing" className="mt-4">
          <LandingpagePrepPanel />
        </TabsContent>
        <TabsContent value="outreach" className="mt-4">
          <OutreachCockpitPanel />
        </TabsContent>
        <TabsContent value="budget" className="mt-4">
          <BudgetPlannerPanel />
        </TabsContent>
        <TabsContent value="routing" className="mt-4">
          <RoutingTablePanel />
        </TabsContent>
        <TabsContent value="performance" className="mt-4">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>

      <LeadDrawer
        lead={activeLead}
        onClose={() => setLeadOverride(null)}
        onAddCampaign={(l) => {
          setCampaignLead(l.suggestedCampaign);
          setTabOverride("campaigns");
          setToast(t("growth.leads.addedToCampaign"));
        }}
        onRfqDraft={() => {
          setToast(t("growth.leads.rfqDraft"));
          goToRfq();
        }}
        onLeasingOffer={() => {
          setToast(t("growth.leads.leasingOffer"));
          goToFinance();
        }}
      />
    </div>
  );
}
