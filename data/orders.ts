import { COUNTRIES } from "./constants";
import { pick } from "./generators";
import type { Order } from "./types";

const carriers = ["DHL", "DPD", "UPS", "FedEx"] as const;

export const orders: Order[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ord-${String(i + 1).padStart(3, "0")}`,
  vertical: i < 15 ? "medical" : "robotics",
  buyerId: `buy-${String((i % 10) + (i < 15 ? 1 : 11)).padStart(2, "0")}`,
  supplierId: `sup-${String((i % 10) + (i < 15 ? 1 : 11)).padStart(2, "0")}`,
  status: pick(["processing", "confirmed", "shipped", "partial", "delivered"] as const, i),
  paymentStatus: pick(["paid", "pending", "financed"] as const, i),
  amount: 4200 + i * 5800,
  carrier: pick(carriers, i),
  trackingNumber: `${pick(carriers, i)}${1000000000 + i * 73829}`,
  eta: `2026-0${4 + (i % 4)}-${String(5 + (i % 24)).padStart(2, "0")}`,
  createdAt: `2026-0${1 + (i % 3)}-${String(8 + (i % 20)).padStart(2, "0")}`,
  items: 1 + (i % 8),
  country: pick(COUNTRIES, i),
}));
