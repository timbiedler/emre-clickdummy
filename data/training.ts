import { localize } from "./generators";
import type { LocalizedText, Vertical } from "./types";

export interface TrainingCourse {
  id: string;
  vertical: Vertical;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "published" | "draft";
  country: string;
}

const medicalCourses = [
  "MDR compliance for procurement teams",
  "Hospital RFQ best practices",
  "Care home equipment lifecycle planning",
  "Laboratory consumables sourcing",
  "Emergency medical supply frameworks",
];

const roboticsCourses = [
  "Cleaning robot fleet operations",
  "Security robotics deployment guide",
  "Leasing-first robotics sales",
  "Spare parts planning for AMRs",
  "Showroom demo certification",
];

function makeCourses(titles: string[], vertical: Vertical, start: number): TrainingCourse[] {
  return titles.map((title, i) => ({
    id: `trn-${String(start + i).padStart(3, "0")}`,
    vertical,
    title: localize(title),
    description: localize(`Hands-on module: ${title}`),
    category: vertical === "medical" ? "Compliance & Procurement" : "Robotics Operations",
    duration: `${45 + (i % 3) * 15} min`,
    level: pickLevel(i),
    status: i % 5 === 0 ? "draft" : "published",
    country: "EU-wide",
  }));
}

function pickLevel(i: number): TrainingCourse["level"] {
  if (i % 3 === 0) return "beginner";
  if (i % 3 === 1) return "intermediate";
  return "advanced";
}

export const trainingCourses: TrainingCourse[] = [
  ...makeCourses(medicalCourses, "medical", 1),
  ...makeCourses(roboticsCourses, "robotics", 20),
];
