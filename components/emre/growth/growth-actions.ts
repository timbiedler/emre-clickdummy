"use client";

import { useRouter } from "next/navigation";

export function useGrowthActions() {
  const router = useRouter();

  return {
    goToSourcing: (source: string, refId?: string) => {
      const q = new URLSearchParams({ source, ...(refId ? { ref: refId } : {}) });
      router.push(`/admin/sourcing-desk?${q.toString()}`);
    },
    goToRfq: () => router.push("/rfq"),
    goToOffers: () => router.push("/offers"),
    goToFinance: () => router.push("/finance"),
  };
}
