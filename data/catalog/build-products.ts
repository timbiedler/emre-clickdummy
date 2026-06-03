import type { Country, Product, TranslationStatus, Vertical } from "../types";
import { CARD_GRADIENTS } from "../constants";
import { localize, pick } from "../generators";

export interface CatalogSeed {
  name: string;
  description: string;
  category: string;
  brand: string;
  supplierIndex: number;
  primaryCountry: Country;
  countries: Country[];
  channels: string[];
  price: number;
  financeAvailable: boolean;
  serviceCoverage: boolean;
  availability: Product["availability"];
  stock: number;
  deliveryDays: number;
  imageLabel: string;
  specs: Record<string, string>;
  warrantyMonths?: number;
}

const medicalSupplierNames = [
  "MedSupply Europa GmbH",
  "SafeGuard Distribution AG",
  "EuroDiag Trading BV",
  "VitalCare Logistics SAS",
  "SteriTech Medical Sp. z o.o.",
  "NovaMed Supply Italia",
  "CareLine Procurement SE",
  "LabPrecision Nordic AB",
  "PublicHealth Supply GmbH",
  "EmergencyMed Partners",
];

const roboticsSupplierNames = [
  "RoboClean Distribution GmbH",
  "Nexus Robotics Europe BV",
  "AutoServe Benelux NV",
  "FieldBot DACH AG",
  "ServoTech Robotics S.L.",
  "AgriScan Distribution Sp. z o.o.",
  "SecurePatrol Europe SAS",
  "LogiMove Robotics AB",
  "HospitalityBot Partners",
  "CleanFleet Service GmbH",
];

function buildProducts(
  seeds: CatalogSeed[],
  vertical: Vertical,
  idPrefix: string,
  skuStart: number,
  supplierNames: string[]
): Product[] {
  const statuses: TranslationStatus[] = ["verified", "pending", "auto"];

  return seeds.map((seed, i) => {
    const supplierId = `sup-${String(seed.supplierIndex + (vertical === "robotics" ? 11 : 1)).padStart(2, "0")}`;
    const price = seed.price;
    const tiers =
      vertical === "medical"
        ? [
            { minQty: 1, price },
            { minQty: 50, price: Math.round(price * 0.92) },
            { minQty: 500, price: Math.round(price * 0.85) },
          ]
        : [
            { minQty: 1, price },
            { minQty: 5, price: Math.round(price * 0.94) },
            { minQty: 20, price: Math.round(price * 0.88) },
          ];

    return {
      id: `${idPrefix}-${String(i + 1).padStart(3, "0")}`,
      vertical,
      name: localize(seed.name),
      description: localize(seed.description),
      sku: `${vertical === "medical" ? "MED" : "ROB"}-${skuStart + i}`,
      brand: seed.brand,
      category: seed.category,
      salesChannels: seed.channels,
      price,
      priceTiers: tiers,
      currency: "EUR",
      availability: seed.availability,
      stock: seed.stock,
      primaryCountry: seed.primaryCountry,
      countries: seed.countries,
      certification:
        vertical === "medical"
          ? ["CE", "MDR", "ISO 13485"].slice(0, 2 + (i % 2))
          : ["CE", "RoHS", "ISO 9001"].slice(0, 2 + (i % 2)),
      financeAvailable: true,
      serviceCoverage: seed.serviceCoverage,
      supplierId,
      supplierName: supplierNames[seed.supplierIndex],
      imageGradient: pick(CARD_GRADIENTS, i),
      imageLabel: seed.imageLabel,
      specs: seed.specs,
      aiSummary: localize(
        vertical === "medical"
          ? `${seed.category} procurement item with verified EU compliance documentation and established hospital supply track record.`
          : `${seed.category} platform component with dealer network support, deployment documentation, and EU service coverage.`
      ),
      translationStatus: pick(statuses, i),
      relatedIds: [
        `${idPrefix}-${String(((i + 1) % seeds.length) + 1).padStart(3, "0")}`,
        `${idPrefix}-${String(((i + 3) % seeds.length) + 1).padStart(3, "0")}`,
      ],
      documents:
        vertical === "medical"
          ? [
              { name: "CE Certificate", status: "verified" as const },
              {
                name: "MDR Technical File",
                status: (i % 5 === 0 ? "pending" : "verified") as "verified" | "pending",
              },
              { name: "Data Sheet", status: "verified" as const },
            ]
          : [
              { name: "CE Declaration", status: "verified" as const },
              { name: "Deployment Guide", status: "verified" as const },
              {
                name: "Service Manual",
                status: (i % 6 === 0 ? "pending" : "verified") as "verified" | "pending",
              },
            ],
      deliveryDays: seed.deliveryDays,
      warrantyMonths: seed.warrantyMonths,
    };
  });
}

export { buildProducts, medicalSupplierNames, roboticsSupplierNames };
