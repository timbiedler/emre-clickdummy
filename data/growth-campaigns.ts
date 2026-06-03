import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { CampaignStatus, CampaignType, GrowthCampaign, GrowthVertical } from "./growth-types";

const types: CampaignType[] = [
  "email",
  "google_ads",
  "landingpage",
  "sales_partner",
  "showroom",
  "qr_nfc",
  "deal",
  "leasing",
  "bundle",
  "product_launch",
];

const names = [
  "DACH Hospital Modernization",
  "Benelux FM Robotics Sprint",
  "Nordics Leasing-First Nurture",
  "France Public Tender Watch",
  "Iberia Showroom Activation",
  "CEE Partner Co-Sell Wave",
  "UK-Adjacent EU Test",
  "Care Home Bundle Launch",
  "Cleaning Robot QR Trail",
  "Security Pilot Outreach",
];

export const growthCampaigns: GrowthCampaign[] = Array.from({ length: 20 }, (_, i) => {
  const vertical: GrowthVertical = i % 2 === 0 ? "medical" : "robotics";
  const start = new Date(2026, i % 6, 1 + (i % 20));
  const end = new Date(start);
  end.setDate(end.getDate() + 14 + (i % 21));
  return {
    id: `cmp-${String(i + 1).padStart(3, "0")}`,
    name: pick(names, i),
    type: pick(types, i),
    status: pick(["draft", "scheduled", "active", "paused", "completed"] as CampaignStatus[], i),
    vertical,
    territories: [pick(COUNTRIES, i), pick(COUNTRIES, i + 4)],
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    budget: 8000 + i * 2500,
    leadsTarget: 40 + i * 5,
    channelMix: ["Email", "Google Ads", "Landingpage", "Partner tasks"].slice(0, 2 + (i % 3)),
    owner: pick(["Growth Ops", "Territory Marketing", "Partner Marketing"], i),
    landingpageId: i % 3 === 0 ? `lp-${String((i % 15) + 1).padStart(3, "0")}` : undefined,
    bundleId: i % 4 === 0 ? `bnd-${String((i % 30) + 1).padStart(3, "0")}` : undefined,
  };
});
