import { pick } from "./generators";
import type { FinanceApplication } from "./types";

export const financeApplications: FinanceApplication[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: `fin-${String(i + 1).padStart(2, "0")}`,
    vertical: i < 8 ? "medical" : "robotics",
    company: pick(
      [
        "CareGroup Nord GmbH",
        "Universitätsklinikum München",
        "Hotel Group Alpine",
        "CleanPro Facility Services",
        "Labor Diagnostik Network",
        "AutoPark Dealership Network",
      ],
      i
    ),
    product: pick(
      [
        "Patient Monitor Fleet",
        "Oxygen Concentrator Bundle",
        "Cleaning Robot Package",
        "Warehouse AMR Deployment",
        "Lab Equipment Lease",
        "Security Robot Fleet",
      ],
      i
    ),
    amount: 45000 + i * 28000,
    termMonths: pick([24, 36, 48, 60], i),
    type: pick(["leasing", "financing", "finetrading"] as const, i),
    status: pick(
      ["documents_missing", "under_review", "pre_approved", "offer_ready"] as const,
      i
    ),
    monthlyRate: 890 + i * 420,
    documentScore: 40 + (i % 6) * 10,
  })
);
