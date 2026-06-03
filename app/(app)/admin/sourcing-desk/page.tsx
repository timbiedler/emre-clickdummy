"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/emre/app-shell";
import { DemandGapCard } from "@/components/emre/sourcing/demand-gap-card";
import { ProductGapDrawer } from "@/components/emre/sourcing/product-gap-drawer";
import { SourcingKpiSection } from "@/components/emre/sourcing/sourcing-kpi-section";
import { SourcingPipelineBoard } from "@/components/emre/sourcing/sourcing-pipeline-board";
import { EnrichmentChecklist } from "@/components/emre/sourcing/enrichment-checklist";
import { ReturnedProductCard } from "@/components/emre/sourcing/returned-product-card";
import { InterestedBuyerRow } from "@/components/emre/sourcing/interested-buyer-row";
import { StatusBadge } from "@/components/emre/status-badge";
import {
  useSourcing,
  catalogExpansionItems,
  productEnrichmentItems,
  returnedProducts,
  sourcingSuppliers,
  interestedBuyers,
} from "@/context/sourcing-context";
import { sourcingOwners } from "@/data/sourcing";
import type { CreateGapRequestInput, ProductGapRequest } from "@/data/sourcing-types";
import { useUi } from "@/lib/ui-i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ExternalLink } from "lucide-react";

export default function SourcingDeskPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <SourcingDeskContent />
    </Suspense>
  );
}

function SourcingDeskContent() {
  const { t } = useUi();
  const {
    demandGaps,
    productGapRequests,
    createGapFromDemand,
    archiveDemandGap,
    assignRequestOwner,
    setSelectedRequestId,
    selectedRequestId,
    openCreateGapDrawer,
    notifyInterestedBuyers,
  } = useSourcing();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [detailRequest, setDetailRequest] = useState<ProductGapRequest | null>(null);

  const openDetail = (r: ProductGapRequest) => {
    setDetailRequest(r);
    setSelectedRequestId(r.id);
  };

  useEffect(() => {
    const source = searchParams.get("source");
    const ref = searchParams.get("ref");
    if (source) {
      openCreateGapDrawer({
        source: source as CreateGapRequestInput["source"],
        requestedProduct: ref ? `Growth ref ${ref}` : "",
        notes: `From Growth & Territory Engine (${source}${ref ? ` · ${ref}` : ""})`,
        urgency: "high",
      });
    }
  }, [searchParams, openCreateGapDrawer]);

  const requestFromUrl = useMemo(() => {
    const requestId = searchParams.get("requestId");
    if (requestId) return productGapRequests.find((r) => r.id === requestId) ?? null;
    const gapId = searchParams.get("gapId");
    if (gapId) {
      const gap = demandGaps.find((g) => g.id === gapId);
      if (gap?.linkedRequestId) {
        return productGapRequests.find((r) => r.id === gap.linkedRequestId) ?? null;
      }
    }
    return null;
  }, [searchParams, productGapRequests, demandGaps]);

  const selected = useMemo(
    () =>
      productGapRequests.find((r) => r.id === selectedRequestId) ??
      detailRequest ??
      requestFromUrl,
    [productGapRequests, selectedRequestId, detailRequest, requestFromUrl]
  );

  const filteredGaps = demandGaps.filter(
    (g) =>
      g.status !== "archived" &&
      (search === "" ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.requestedProduct.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredRequests = productGapRequests.filter(
    (r) =>
      search === "" || r.requestedProduct.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="sourcing.deskTitle"
        descriptionKey="sourcing.deskSubtitle"
        action={
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                openCreateGapDrawer({ source: "marketplace_search", requestedProduct: "" })
              }
            >
              {t("sourcing.createGapRequest")}
            </Button>
            <Link href="/admin/growth">
              <Button variant="outline" className="gap-1">
                {t("sourcing.growthEngine")} <ExternalLink className="size-3" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{t("sourcing.loopTitle")}</p>
        <p className="mt-1 text-slate-600">{t("sourcing.loopDescription")}</p>
      </div>

      <SourcingKpiSection />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          className="pl-9"
          placeholder={t("sourcing.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="gaps">
        <TabsList className="surface-card border-slate-200 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="gaps">{t("sourcing.tabDemandGaps")}</TabsTrigger>
          <TabsTrigger value="requests">{t("sourcing.tabGapRequests")}</TabsTrigger>
          <TabsTrigger value="suppliers">{t("sourcing.tabSupplierSourcing")}</TabsTrigger>
          <TabsTrigger value="catalog">{t("sourcing.tabCatalogExpansion")}</TabsTrigger>
          <TabsTrigger value="enrichment">{t("sourcing.tabEnrichment")}</TabsTrigger>
          <TabsTrigger value="pipeline">{t("sourcing.tabPipeline")}</TabsTrigger>
          <TabsTrigger value="returned">{t("sourcing.tabReturned")}</TabsTrigger>
          <TabsTrigger value="buyers">{t("sourcing.tabInterestedBuyers")}</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="mt-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredGaps.map((gap) => (
              <DemandGapCard
                key={gap.id}
                gap={gap}
                onCreateRequest={() => createGapFromDemand(gap.id)}
                onAssign={() =>
                  gap.linkedRequestId &&
                  assignRequestOwner(gap.linkedRequestId, sourcingOwners[0].id)
                }
                onArchive={() => archiveDemandGap(gap.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="surface-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t("sourcing.requestedProduct")}</TableHead>
                  <TableHead>{t("sourcing.country")}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => openDetail(r)}
                  >
                    <TableCell className="text-xs font-mono">{r.id}</TableCell>
                    <TableCell className="text-sm font-medium">{r.requestedProduct}</TableCell>
                    <TableCell className="text-xs">{r.country}</TableCell>
                    <TableCell>
                      <StatusBadge variant="info">{r.status.replace(/_/g, " ")}</StatusBadge>
                    </TableCell>
                    <TableCell className="text-xs text-blue-600">{t("sourcing.viewDetail")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {sourcingSuppliers.slice(0, 20).map((s) => (
              <div key={s.id} className="surface-card rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <StatusBadge variant="success">{s.productMatchScore}% match</StatusBadge>
                </div>
                <p className="text-xs text-slate-500">
                  {s.country} · {s.onboardingStatus.replace(/_/g, " ")}
                </p>
                <Button size="sm" variant="outline" className="h-8 mt-2">
                  {t("sourcing.contactSupplier")}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="mt-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {catalogExpansionItems.map((item) => (
              <div key={item.id} className="surface-card rounded-xl p-4 space-y-2">
                <p className="font-semibold text-sm">{item.productName}</p>
                <p className="text-xs text-slate-500">{item.supplierName}</p>
                <p className="text-xs">
                  {t("sourcing.catalogScore")}: {item.catalogReadinessScore}% ·{" "}
                  {t("sourcing.marketplaceReadiness")}: {item.marketplaceReadinessScore}%
                </p>
                <Button size="sm" variant="outline" className="h-8">
                  {t("sourcing.enrichProduct")}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrichment" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {productEnrichmentItems.map((item) => (
              <EnrichmentChecklist key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <SourcingPipelineBoard
            requests={productGapRequests}
            onSelect={(id) => {
              const r = productGapRequests.find((x) => x.id === id);
              if (r) openDetail(r);
            }}
          />
        </TabsContent>

        <TabsContent value="returned" className="mt-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {returnedProducts.map((p) => (
              <ReturnedProductCard key={p.id} product={p} onPublish={() => {}} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="buyers" className="mt-4">
          <div className="surface-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("sourcing.company")}</TableHead>
                  <TableHead>{t("sourcing.requestedProduct")}</TableHead>
                  <TableHead>{t("sourcing.country")}</TableHead>
                  <TableHead>{t("sourcing.volume")}</TableHead>
                  <TableHead>{t("sourcing.budget")}</TableHead>
                  <TableHead>{t("sourcing.notification")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestedBuyers.map((b) => (
                  <InterestedBuyerRow
                    key={b.id}
                    buyer={b}
                    onNotify={() =>
                      b.linkedRequestId && notifyInterestedBuyers(b.linkedRequestId)
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <ProductGapDrawer
        request={selected}
        open={!!selected}
        onClose={() => {
          setDetailRequest(null);
          setSelectedRequestId(null);
        }}
      />
    </div>
  );
}
