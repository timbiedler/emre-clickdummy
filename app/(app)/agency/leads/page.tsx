"use client";

import { ChartNoAxesCombined, Filter, MailCheck, Users2 } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

export default function AgencyLeadsPage() {
  return (
    <PortalDashboard
      title="Agency Leads"
      description="Validate lead quality, route prospects to partner teams, and monitor acceptance rates by segment."
      kpis={[
        { label: "New marketing leads", value: 204, change: 13, icon: Users2, accent: "blue" },
        { label: "Accepted by sales", value: "78%", change: 5, icon: MailCheck, accent: "green" },
        { label: "Lead score avg", value: "71/100", change: 4, icon: ChartNoAxesCombined, accent: "violet" },
        { label: "Filtered out", value: "9%", change: -2, icon: Filter, accent: "slate" },
      ]}
      tables={[
        {
          title: "Lead handoff table",
          rows: [
            { cols: ["AGL-5182", "Industrial Automation", "Assigned to Sales Partner", "approved"] },
            { cols: ["AGL-5187", "Healthcare", "Qualification pending", "review"] },
            { cols: ["AGL-5191", "Hospitality", "Assigned to Dealer", "approved"] },
          ],
        },
      ]}
      actions={[
        { label: "Open campaigns", href: "/agency/campaigns" },
        { label: "Back to agency dashboard", href: "/agency" },
      ]}
    />
  );
}
