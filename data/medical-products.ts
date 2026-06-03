import { buildProducts, medicalSupplierNames } from "./catalog/build-products";
import { medicalCatalogSeeds } from "./catalog/medical-catalog-seeds";

export const medicalProducts = buildProducts(
  medicalCatalogSeeds,
  "medical",
  "med",
  1000,
  medicalSupplierNames
);
