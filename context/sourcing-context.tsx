"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  catalogExpansionItems as initialCatalog,
  demandGaps as initialGaps,
  initialFailedSearches,
  interestedBuyers as initialBuyers,
  productEnrichmentItems as initialEnrichment,
  productGapRequests as initialRequests,
  returnedProducts as initialReturned,
  sourcingSuppliers as initialSuppliers,
} from "@/data/sourcing";
import type {
  CreateGapRequestInput,
  DemandGap,
  FailedMarketplaceSearch,
  ProductGapRequest,
  ProductGapRequestStatus,
} from "@/data/sourcing-types";
import { useApp } from "./app-context";

interface SourcingContextValue {
  demandGaps: DemandGap[];
  productGapRequests: ProductGapRequest[];
  failedSearches: FailedMarketplaceSearch[];
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  gapDrawerOpen: boolean;
  setGapDrawerOpen: (open: boolean) => void;
  gapDrawerPrefill: CreateGapRequestInput | null;
  openCreateGapDrawer: (prefill?: CreateGapRequestInput) => void;
  createProductGapRequest: (input: CreateGapRequestInput) => ProductGapRequest;
  createGapFromDemand: (gapId: string) => ProductGapRequest;
  updateRequestStatus: (id: string, status: ProductGapRequestStatus) => void;
  assignRequestOwner: (id: string, ownerId: string) => void;
  archiveDemandGap: (id: string) => void;
  linkDemandToRequest: (gapId: string, requestId: string) => void;
  recordFailedSearch: (query: string) => void;
  notifyInterestedBuyers: (requestId: string) => void;
  markReturnedLaunched: (id: string) => void;
  getRequestById: (id: string) => ProductGapRequest | undefined;
}

const SourcingContext = createContext<SourcingContextValue | null>(null);


export function SourcingProvider({ children }: { children: ReactNode }) {
  const { industry, workspaceCountry, role } = useApp();
  const [demandGaps, setDemandGaps] = useState(initialGaps);
  const [productGapRequests, setProductGapRequests] = useState(initialRequests);
  const [failedSearches, setFailedSearches] = useState(initialFailedSearches);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [gapDrawerOpen, setGapDrawerOpen] = useState(false);
  const [gapDrawerPrefill, setGapDrawerPrefill] = useState<CreateGapRequestInput | null>(null);

  const createProductGapRequest = useCallback(
    (input: CreateGapRequestInput): ProductGapRequest => {
      const now = new Date().toISOString().slice(0, 10);
      let created!: ProductGapRequest;
      setProductGapRequests((prev) => {
        const id = `pgr-${String(prev.length + 1).padStart(3, "0")}`;
        created = {
          id,
          requestedProduct: input.requestedProduct,
          category: input.category ?? "General",
          vertical: input.vertical ?? "combined",
          industry: input.industry ?? industry,
          country: input.country ?? workspaceCountry,
          region: input.region ?? "EU",
          source: input.source,
          linkedRfqIds: input.linkedRfqIds ?? [],
          linkedCampaignIds: [],
          linkedGroupBuyIds: [],
          linkedLeadIds: [],
          interestedBuyerIds: [],
          estimatedVolume: input.estimatedVolume ?? "TBD",
          expectedBudget: input.expectedBudget ?? 50000,
          targetLeasingRate: 120,
          urgency: input.urgency ?? "high",
          requiredCertifications: ["CE"],
          requiredServiceCoverage: true,
          requiredWarranty: true,
          requiredFinanceOption: true,
          minimumDeliveryDays: 21,
          notes: input.notes ?? input.aiPrompt ?? "",
          aiSourcingRecommendation:
            "New request — route to Supplier Sourcing and assign regional owner.",
          status: "new",
          linkedDemandGapId: input.linkedDemandGapId,
          linkedSupplierIds: [],
          createdAt: now,
          updatedAt: now,
        };
        return [created, ...prev];
      });
      if (input.linkedDemandGapId && created) {
        setDemandGaps((prev) =>
          prev.map((g) =>
            g.id === input.linkedDemandGapId
              ? { ...g, status: "linked" as const, linkedRequestId: created.id }
              : g
          )
        );
      }
      if (created) setSelectedRequestId(created.id);
      return created;
    },
    [industry, workspaceCountry]
  );

  const createGapFromDemand = useCallback(
    (gapId: string) => {
      const gap = demandGaps.find((g) => g.id === gapId);
      if (!gap) throw new Error("Demand gap not found");
      return createProductGapRequest({
        requestedProduct: gap.requestedProduct,
        category: gap.category,
        vertical: gap.vertical,
        industry: gap.industry,
        country: gap.country,
        region: gap.region,
        source: gap.source,
        expectedBudget: gap.estimatedBudget,
        estimatedVolume: gap.estimatedVolume,
        urgency: gap.priority,
        linkedDemandGapId: gapId,
        linkedRfqIds: gap.linkedRfqIds,
      });
    },
    [demandGaps, createProductGapRequest]
  );

  const updateRequestStatus = useCallback((id: string, status: ProductGapRequestStatus) => {
    setProductGapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString().slice(0, 10) } : r))
    );
  }, []);

  const assignRequestOwner = useCallback((id: string, ownerId: string) => {
    setProductGapRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, assignedOwner: ownerId } : r))
    );
  }, []);

  const archiveDemandGap = useCallback((id: string) => {
    setDemandGaps((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: "archived" as const } : g))
    );
  }, []);

  const linkDemandToRequest = useCallback((gapId: string, requestId: string) => {
    setDemandGaps((prev) =>
      prev.map((g) =>
        g.id === gapId ? { ...g, status: "linked" as const, linkedRequestId: requestId } : g
      )
    );
  }, []);

  const recordFailedSearch = useCallback(
    (query: string) => {
      const entry: FailedMarketplaceSearch = {
        id: `fs-${Date.now()}`,
        query,
        industry,
        country: workspaceCountry,
        role,
        timestamp: new Date().toISOString(),
      };
      setFailedSearches((prev) => [entry, ...prev].slice(0, 50));
    },
    [industry, workspaceCountry, role]
  );

  const openCreateGapDrawer = useCallback((prefill?: CreateGapRequestInput) => {
    setGapDrawerPrefill(prefill ?? null);
    setGapDrawerOpen(true);
  }, []);

  const notifyInterestedBuyers = useCallback((requestId: string) => {
    updateRequestStatus(requestId, "buyers_notified");
  }, [updateRequestStatus]);

  const markReturnedLaunched = useCallback((_id: string) => {
    void _id;
  }, []);

  const getRequestById = useCallback(
    (id: string) => productGapRequests.find((r) => r.id === id),
    [productGapRequests]
  );

  const value = useMemo(
    () => ({
      demandGaps,
      productGapRequests,
      failedSearches,
      selectedRequestId,
      setSelectedRequestId,
      gapDrawerOpen,
      setGapDrawerOpen,
      gapDrawerPrefill,
      openCreateGapDrawer,
      createProductGapRequest,
      createGapFromDemand,
      updateRequestStatus,
      assignRequestOwner,
      archiveDemandGap,
      linkDemandToRequest,
      recordFailedSearch,
      notifyInterestedBuyers,
      markReturnedLaunched,
      getRequestById,
    }),
    [
      demandGaps,
      productGapRequests,
      failedSearches,
      selectedRequestId,
      gapDrawerOpen,
      gapDrawerPrefill,
      openCreateGapDrawer,
      createProductGapRequest,
      createGapFromDemand,
      updateRequestStatus,
      assignRequestOwner,
      archiveDemandGap,
      linkDemandToRequest,
      recordFailedSearch,
      notifyInterestedBuyers,
      markReturnedLaunched,
      getRequestById,
    ]
  );

  return <SourcingContext.Provider value={value}>{children}</SourcingContext.Provider>;
}

export function useSourcing() {
  const ctx = useContext(SourcingContext);
  if (!ctx) throw new Error("useSourcing must be used within SourcingProvider");
  return ctx;
}

export {
  initialCatalog as catalogExpansionItems,
  initialEnrichment as productEnrichmentItems,
  initialReturned as returnedProducts,
  initialSuppliers as sourcingSuppliers,
  initialBuyers as interestedBuyers,
};
