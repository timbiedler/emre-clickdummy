"use client";

import { Building, Phone, TimerReset, UserRoundPlus } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function DealerLeadsPage() {
  return (
    <PortalDashboard
      title="Dealer Leads"
      description="Handle showroom and digital leads with clear ownership, follow-up cadence, and conversion tracking."
      kpis={[
        { label: "New today", value: 19, change: 12, icon: UserRoundPlus, accent: "blue" },
        { label: "Enterprise buyers", value: 11, change: 4, icon: Building, accent: "green" },
        { label: "Calls scheduled", value: 23, change: 9, icon: Phone, accent: "violet" },
        { label: "Overdue follow-ups", value: 7, change: -5, icon: TimerReset, accent: "slate" },
      ]}
      tables={[
        {
          title: "Lead assignment table",
          rows: [
            { cols: ["DL-2201", "Nordic Logistics Oy", "A. Reinhardt", "2h ago", "approved"] },
            { cols: ["DL-2202", "Careline Clinics", "M. Yildiz", "5h ago", "review"] },
            { cols: ["DL-2203", "Urban Delivery Fleet", "E. Durand", "1d ago", "approved"] },
            { cols: ["DL-2204", "Hotel Nova Group", "S. Becker", "1d ago", "review"] },
          ],
        },
      ]}
      actions={[
        { label: "Back to dealer dashboard", href: "/dealer" },
        { label: "Open campaigns", href: "/dealer/campaigns" },
      ]}
    />
  );
}
