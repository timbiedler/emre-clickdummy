"use client";

import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { offers } from "@/data/offers";
import { suppliers } from "@/data/suppliers";
import { FileText, CheckCircle, Clock } from "lucide-react";

export default function OffersPage() {
  const preApproved = offers.filter((o) => o.financingStatus === "pre_approved").length;
  return (
    <PortalDashboard
      title="Offers"
      description="Submitted and received offers across RFQs, with leasing terms and finance status."
      kpis={[
        { label: "Total Offers", value: offers.length, change: 8.2, icon: FileText, accent: "blue" },
        { label: "Pre-approved", value: preApproved, icon: CheckCircle, accent: "green" },
        { label: "Under Review", value: offers.filter((o) => o.financingStatus === "under_review").length, icon: Clock, accent: "violet" },
        { label: "With Leasing", value: offers.filter((o) => o.leasingRateMonthly > 0).length, accent: "slate" },
      ]}
      tables={[
        {
          title: "Recent offers",
          rows: offers.slice(0, 8).map((o) => {
            const sup = suppliers.find((s) => s.id === o.supplierId);
            return {
              cols: [
                o.id,
                sup?.name ?? o.supplierId,
                `€${o.price.toLocaleString()}`,
                `€${o.leasingRateMonthly}/mo`,
                o.financingStatus.replace(/_/g, " "),
              ],
            };
          }),
        },
      ]}
      actions={[
        { label: "Compare offers", href: "/rfq" },
        { label: "Finance check", href: "/finance" },
      ]}
    />
  );
}
