import { GRADIENTS } from "./constants";
import { localize, pick } from "./generators";
import type { MagazineItem } from "./types";

const medicalArticles = [
  "How care groups compare diagnostic suppliers",
  "MDR document readiness checklist",
  "Emergency procurement playbook",
  "How hospitals reduce procurement time with RFQs",
  "PPE volume sourcing strategies for EU care networks",
  "Laboratory consumables consolidation guide",
  "Public sector medical supply framework contracts",
  "Sterilization equipment lifecycle management",
  "Respiratory care procurement benchmarks",
  "Multi-site care home supply chain optimization",
];

const roboticsArticles = [
  "Cleaning robot ROI in hotels",
  "Security patrol robots for large facilities",
  "Spare parts planning for robot fleets",
  "How car dealerships use cleaning robots in showrooms",
  "Warehouse AMR deployment best practices",
  "Agricultural inspection robotics field guide",
  "Fleet service contracts: total cost analysis",
  "Municipal robotics procurement framework",
  "Hospitality service robot guest experience impact",
  "Industrial site security robot integration",
];

function makeMagazine(
  titles: string[],
  vertical: "medical" | "robotics",
  startId: number
): MagazineItem[] {
  const types: MagazineItem["type"][] = [
    "article",
    "video",
    "case_study",
    "guide",
    "comparison",
  ];
  return titles.map((title, i) => ({
    id: `mag-${String(startId + i).padStart(3, "0")}`,
    vertical,
    type: pick(types, i),
    title: localize(title),
    excerpt: localize(
      `Expert analysis on ${title.toLowerCase()} for EU B2B procurement teams.`
    ),
    readTime: `${4 + (i % 8)} min`,
    publishedAt: `2026-0${1 + (i % 4)}-${String(3 + (i % 25)).padStart(2, "0")}`,
    author: pick(["EMRE Editorial", "Industry Analyst", "Procurement Lead"], i),
    imageGradient: pick(GRADIENTS, i),
  }));
}

export const magazineItems: MagazineItem[] = [
  ...makeMagazine(medicalArticles, "medical", 1),
  ...makeMagazine(roboticsArticles, "robotics", 11),
];
