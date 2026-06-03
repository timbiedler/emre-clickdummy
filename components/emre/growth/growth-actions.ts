"use client";

import { useRouter } from "next/navigation";
import type { GrowthLead } from "@/data/growth-types";
import type { CreateRfqPrefill } from "@/context/rfq-context";
import { useRfq } from "@/context/rfq-context";

export function useGrowthActions() {
  const router = useRouter();
  const { openCreateRfq } = useRfq();

  return {
    goToSourcing: (source: string, refId?: string) => {
      const q = new URLSearchParams({ source, ...(refId ? { ref: refId } : {}) });
      router.push(`/admin/sourcing-desk?${q.toString()}`);
    },
    goToRfq: (prefill?: CreateRfqPrefill) => {
      if (prefill) openCreateRfq(prefill);
      else router.push("/rfq");
    },
    openRfqFromLead: (lead: GrowthLead) => {
      openCreateRfq({
        source: "lead",
        lead,
        leadId: lead.id,
        vertical: lead.vertical,
        companyName: lead.company,
        industry: lead.industry,
        deliveryCountry: lead.country,
        bundleName: lead.productFit[0],
        financeInterest: lead.financePotential !== "low",
        leasingInterest: lead.financePotential === "high",
      });
    },
    goToOffers: () => router.push("/offers"),
    goToFinance: () => router.push("/finance"),
  };
}
