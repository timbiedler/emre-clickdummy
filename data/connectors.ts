import { pick } from "./generators";
import type { Country, Vertical } from "./types";

export type ConnectorType = "erp" | "crm" | "api" | "webhook" | "edi";

export interface PlatformConnector {
  id: string;
  name: string;
  type: ConnectorType;
  status: "active" | "paused" | "error" | "draft";
  description: string;
  vertical?: Vertical | "both";
  country?: Country;
  lastSync?: string;
  eventsPerDay?: number;
}

const names = [
  "SAP Business One",
  "Microsoft Dynamics",
  "HubSpot CRM",
  "Salesforce Partner Cloud",
  "Orders webhook (EU)",
  "RFQ status API",
  "Finance pre-approval hook",
  "Inventory EDI bridge",
  "Growth signals webhook",
  "Service ticket sync",
];

export const platformConnectors: PlatformConnector[] = Array.from({ length: 16 }, (_, i) => ({
  id: `con-${String(i + 1).padStart(3, "0")}`,
  name: pick(names, i),
  type: pick(["erp", "crm", "api", "webhook", "edi"] as ConnectorType[], i),
  status: pick(["active", "paused", "error", "draft"] as const, i),
  description: pick(
    [
      "Bidirectional order and catalog sync",
      "Lead and campaign attribution feed",
      "Real-time RFQ offer notifications",
      "Invoice and leasing status updates",
      "Partner commission export",
    ],
    i + 1
  ),
  vertical: i % 3 === 0 ? undefined : i % 2 === 0 ? "medical" : "robotics",
  lastSync: i % 4 === 0 ? undefined : `2026-03-${String(10 + (i % 18)).padStart(2, "0")}T08:00:00Z`,
  eventsPerDay: 120 + i * 340,
}));
