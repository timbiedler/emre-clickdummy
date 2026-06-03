"use client";

import { CalendarRange, ClipboardCheck, HandCoins, MessageSquareQuote } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function ServicePartnerRequestsPage() {
  return (
    <PortalDashboard
      title="Service Requests"
      description="Manage preventive maintenance visits, customer call-backs, and premium support requests."
      kpis={[
        { label: "Incoming requests", value: 38, change: 9, icon: MessageSquareQuote, accent: "blue" },
        { label: "Scheduled visits", value: 26, change: 4, icon: CalendarRange, accent: "green" },
        { label: "Approved estimates", value: 18, change: 6, icon: ClipboardCheck, accent: "violet" },
        { label: "Billable value", value: "€214k", change: 8, icon: HandCoins, accent: "slate" },
      ]}
      tables={[
        {
          title: "Request tracker",
          rows: [
            { cols: ["REQ-811", "Preventive maintenance package", "Munich", "approved"] },
            { cols: ["REQ-816", "Premium uptime extension", "Rotterdam", "review"] },
            { cols: ["REQ-822", "After-hours support renewal", "Zurich", "approved"] },
          ],
        },
      ]}
      actions={[
        { label: "Open tickets", href: "/service-partner/tickets" },
        { label: "Check spare parts", href: "/service-partner/spare-parts" },
      ]}
    />
  );
}
