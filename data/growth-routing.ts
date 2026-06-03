import { growthLeads } from "./growth-leads";
import { salesPartners } from "./sales-partners";
import { pick } from "./generators";
import type { GrowthRoutingRow } from "./growth-types";

export const growthRoutingRows: GrowthRoutingRow[] = growthLeads
  .filter((l) => l.status === "assigned" || l.status === "qualified" || l.status === "nurturing")
  .slice(0, 45)
  .map((lead, i) => ({
    id: `route-${String(i + 1).padStart(3, "0")}`,
    leadId: lead.id,
    company: lead.company,
    country: lead.country,
    partner: pick(salesPartners, i).name,
    status: lead.status,
    lastAction: pick(["Email sent", "Partner notified", "RFQ draft", "Offer prep"], i),
    openRfqs: i % 4,
  }));
