import { pick } from "./generators";
import type { DataRoomDocument } from "./types";

const docTypes = [
  { name: "BWA (Business Assessment)", category: "Financial" },
  { name: "Annual Financial Statement", category: "Financial" },
  { name: "Bank Statements (3 months)", category: "Financial" },
  { name: "Company Registration Extract", category: "Corporate" },
  { name: "VAT ID Certificate", category: "Corporate" },
  { name: "Financing Application Form", category: "Finance" },
  { name: "Leasing Agreement Draft", category: "Finance" },
  { name: "Insurance Certificate", category: "Compliance" },
  { name: "Procurement Approval Letter", category: "Procurement" },
  { name: "Authorized Signatory List", category: "Corporate" },
];

export const dataRoomDocuments: DataRoomDocument[] = Array.from(
  { length: 20 },
  (_, i) => {
    const doc = pick(docTypes, i);
    const status = pick(
      ["verified", "uploaded", "missing", "rejected"] as const,
      i
    );
    return {
      id: `doc-${String(i + 1).padStart(3, "0")}`,
      vertical: i < 10 ? "medical" : "robotics",
      name: doc.name,
      category: doc.category,
      status,
      uploadedAt:
        status !== "missing"
          ? `2026-0${2 + (i % 3)}-${String(5 + (i % 20)).padStart(2, "0")}`
          : undefined,
      required: i % 3 !== 2,
    };
  }
);
