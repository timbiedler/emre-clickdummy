import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type {
  ConsentStatus,
  GrowthEmailSequence,
  GrowthGoogleAdDraft,
  GrowthPartnerTask,
  GrowthVertical,
} from "./growth-types";

const consent: ConsentStatus[] = ["opted_in", "legitimate_interest", "pending", "opted_out"];

export const growthEmailSequences: GrowthEmailSequence[] = Array.from({ length: 20 }, (_, i) => ({
  id: `eml-${String(i + 1).padStart(3, "0")}`,
  name: `Enterprise nurture ${i + 1}`,
  steps: 3 + (i % 5),
  openRate: 28 + (i % 22),
  replyRate: 4 + (i % 9),
  consent: pick(consent, i),
  territory: pick(COUNTRIES, i),
  vertical: (i % 2 === 0 ? "medical" : "robotics") as GrowthVertical,
  status: pick(["draft", "active", "paused"] as const, i),
}));

export const growthGoogleAdDrafts: GrowthGoogleAdDraft[] = Array.from({ length: 10 }, (_, i) => ({
  id: `gad-${String(i + 1).padStart(3, "0")}`,
  campaignName: `Search — ${pick(COUNTRIES, i)} ${i % 2 === 0 ? "Medical" : "Robotics"}`,
  headline: "Enterprise equipment with service & leasing",
  description: "Compliant B2B campaigns. Request offer or book partner consultation.",
  budgetDaily: 120 + i * 35,
  territory: pick(COUNTRIES, i),
  consent: pick(consent, i + 1),
  status: pick(["draft", "review", "ready"] as const, i),
}));

export const growthPartnerTasks: GrowthPartnerTask[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ptsk-${String(i + 1).padStart(3, "0")}`,
  partner: pick(
    ["MedEquip Partners DACH", "RoboServe Benelux", "Nordic Distribution Partners", "FacilityBot Resellers"],
    i
  ),
  leadId: `lead-${String((i % 100) + 1).padStart(4, "0")}`,
  task: pick(
    ["Discovery call", "Showroom demo", "RFQ follow-up", "Offer presentation", "Leasing paperwork"],
    i
  ),
  dueDate: new Date(2026, 5, 1 + (i % 28)).toISOString().slice(0, 10),
  priority: pick(["low", "medium", "high"] as const, i),
  status: pick(["open", "in_progress", "done"] as const, i),
  territory: pick(COUNTRIES, i),
}));
