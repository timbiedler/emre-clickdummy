import type { GrowthPerformanceKpis } from "./growth-types";

export const growthPerformanceKpis: GrowthPerformanceKpis = {
  leadsDiscovered: 2840,
  signalsProcessed: 412,
  campaignsActive: 12,
  outreachSent: 1860,
  mqlConversion: 38.4,
  sqlConversion: 16.2,
  rfqsCreated: 186,
  offersPrepared: 94,
  leasingPipeline: 2.4,
  partnerTasksOpen: 22,
  budgetUtilization: 67,
  roiYtd: 2.8,
  whiteSpotsClosed: 14,
  territoryCoverage: 78,
};

export const growthPerformanceTrend = [
  { week: "W18", leads: 120, mql: 48, won: 8 },
  { week: "W19", leads: 142, mql: 55, won: 9 },
  { week: "W20", leads: 158, mql: 61, won: 11 },
  { week: "W21", leads: 171, mql: 68, won: 12 },
  { week: "W22", leads: 189, mql: 74, won: 14 },
  { week: "W23", leads: 205, mql: 82, won: 15 },
];
