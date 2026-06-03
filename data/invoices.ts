import { pick } from "./generators";
import type { Invoice } from "./types";

export const invoices: Invoice[] = Array.from({ length: 20 }, (_, i) => ({
  id: `inv-${String(i + 1).padStart(3, "0")}`,
  invoiceNumber: `EMRE-2026-${String(1000 + i)}`,
  orderId: `ord-${String(i + 1).padStart(3, "0")}`,
  vertical: i < 10 ? "medical" : "robotics",
  amount: 3800 + i * 4200,
  dueDate: `2026-0${5 + (i % 3)}-${String(1 + (i % 28)).padStart(2, "0")}`,
  status: pick(["paid", "pending", "overdue", "financed"] as const, i),
  financingStatus: pick(["none", "applied", "approved"] as const, i),
  buyerId: `buy-${String((i % 10) + (i < 10 ? 1 : 11)).padStart(2, "0")}`,
}));
