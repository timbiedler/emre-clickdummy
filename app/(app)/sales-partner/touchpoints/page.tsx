"use client";

import { ContactRound, Nfc, QrCode, Zap } from "lucide-react";
import { PortalDashboard } from "@/components/portals/portal-dashboard";

const campaigns = [
  ["Hospital Demo Week QR", "DACH", "1,842 scans", "36% conversion", "approved"],
  ["Retail Counter NFC Tap", "Benelux", "1,201 taps", "29% conversion", "approved"],
  ["Service Fair Smart Badge", "Nordics", "963 interactions", "24% conversion", "review"],
  ["Distributor Expo QR", "Southern EU", "1,110 scans", "31% conversion", "approved"],
];

export default function SalesPartnerTouchpointsPage() {
  return (
    <PortalDashboard
      title="QR / NFC Campaigns"
      description="Track omnichannel touchpoints from showroom QR placements and NFC assets used by the partner field team."
      kpis={[
        { label: "Live campaigns", value: 18, change: 15, icon: Zap, accent: "blue" },
        { label: "QR scans", value: "6,742", change: 11, icon: QrCode, accent: "green" },
        { label: "NFC taps", value: "4,983", change: 8, icon: Nfc, accent: "violet" },
        { label: "Qualified contacts", value: 721, change: 13, icon: ContactRound, accent: "slate" },
      ]}
      tables={[
        {
          title: "Campaign performance",
          rows: campaigns.map((row) => ({ cols: row })),
        },
      ]}
      actions={[
        { label: "Back to dashboard", href: "/sales-partner" },
        { label: "Open commissions", href: "/sales-partner/commissions" },
      ]}
      actionButton={{ label: "Create campaign brief", href: "/sales-partner/touchpoints" }}
    />
  );
}
