import type { GrowthBudgetPlan } from "./growth-types";

export const growthBudgetPlans: GrowthBudgetPlan[] = Array.from({ length: 20 }, (_, i) => {
  const total = 25000 + i * 8000;
  const emailPct = 25 + (i % 15);
  const adsPct = 20 + (i % 20);
  const partnerPct = 30 + (i % 10);
  const landingPct = 100 - emailPct - adsPct - partnerPct;
  const leads = 200 + i * 40;
  return {
    id: `bud-${String(i + 1).padStart(3, "0")}`,
    name: `FY26 Growth Plan ${i + 1}`,
    period: i < 10 ? "Q2 2026" : "H2 2026",
    totalBudget: total,
    emailPct,
    adsPct,
    partnerPct,
    landingPct: Math.max(5, landingPct),
    funnelLeads: leads,
    funnelMql: Math.round(leads * 0.42),
    funnelSql: Math.round(leads * 0.18),
    funnelWon: Math.round(leads * 0.06),
    territoryPotential: 65 + (i % 30),
    roiEstimate: 1.4 + (i % 8) * 0.15,
  };
});
