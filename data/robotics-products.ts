import { buildProducts, roboticsSupplierNames } from "./catalog/build-products";
import { roboticsCatalogSeeds } from "./catalog/robotics-catalog-seeds";

export const roboticsProducts = buildProducts(
  roboticsCatalogSeeds,
  "robotics",
  "rob",
  2000,
  roboticsSupplierNames
);
