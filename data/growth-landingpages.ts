import type { GrowthLandingpage, GrowthVertical, LandingpageType } from "./growth-types";
import { COUNTRIES } from "./constants";
import { pick } from "./generators";

const types: LandingpageType[] = [
  "product",
  "bundle",
  "deal",
  "leasing",
  "industry",
  "territory",
  "showroom",
  "service",
];

export const growthLandingpages: GrowthLandingpage[] = Array.from({ length: 15 }, (_, i) => {
  const vertical: GrowthVertical = i % 2 === 0 ? "medical" : "robotics";
  return {
    id: `lp-${String(i + 1).padStart(3, "0")}`,
    title: `${vertical === "medical" ? "Care" : "Automation"} ${pick(types, i)} page ${i + 1}`,
    type: pick(types, i),
    vertical,
    territory: pick(COUNTRIES, i),
    readiness: {
      copy: 70 + (i % 25),
      seo: 60 + (i % 35),
      assets: 55 + (i % 40),
      compliance: 85 + (i % 12),
    },
    aiHeadline:
      vertical === "medical"
        ? "Modernize patient pathways with verified service coverage"
        : "Deploy autonomous operations with leasing-ready bundles",
    aiSubcopy:
      "Compliant B2B value proposition — transparent pricing, service SLAs, and financing options for enterprise buyers.",
    status: pick(["draft", "review", "ready", "published"] as const, i),
  };
});
