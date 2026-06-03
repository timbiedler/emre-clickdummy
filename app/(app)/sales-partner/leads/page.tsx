"use client";

import { Building2, CalendarClock, PhoneCall, UserPlus } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";
import { salesPartners } from "@/data/sales-partners";

export default function SalesPartnerLeadsPage() {
  return (
    <PortalDashboard
      title="Assigned Leads"
      description="Prioritize high-intent accounts, route outreach tasks, and keep SLA response times within target."
      kpis={[
        { label: "Active leads", value: 86, change: 7, icon: UserPlus, accent: "blue" },
        { label: "Enterprise accounts", value: 34, change: 5, icon: Building2, accent: "green" },
        { label: "Calls booked", value: 29, change: 12, icon: PhoneCall, accent: "violet" },
        { label: "SLA at risk", value: 8, change: -9, icon: CalendarClock, accent: "slate" },
      ]}
      tables={[
        {
          title: "Assigned leads queue",
          rows: salesPartners.slice(0, 8).map((partner, index) => ({
            cols: [
              `LEAD-${4200 + index}`,
              partner.name,
              partner.industries[0],
              `${3 + (index % 5)} days open`,
              index % 3 === 0 ? "review" : "approved",
            ],
          })),
        },
      ]}
      actions={[
        { label: "Back to dashboard", href: "/sales-partner" },
        { label: "View pipeline", href: "/sales-partner/pipeline" },
        { label: "Open performance", href: "/sales-partner/performance" },
      ]}
    />
  );
}
