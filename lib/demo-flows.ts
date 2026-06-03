import type { Industry, UserRole, Vertical } from "@/data/types";

export interface DemoFlowStep {
  labelKey: string;
  descKey?: string;
  href: string;
}

export interface DemoFlow {
  id: string;
  titleKey: string;
  subtitleKey: string;
  role: UserRole;
  industry?: Industry;
  vertical?: Vertical;
  steps: DemoFlowStep[];
}

export const DEMO_FLOWS: DemoFlow[] = [
  {
    id: "hospital",
    titleKey: "demo.flows.hospital.title",
    subtitleKey: "demo.flows.hospital.subtitle",
    role: "customer",
    industry: "Hospital / Clinic",
    vertical: "medical",
    steps: [
      { labelKey: "demo.flows.hospital.s1", descKey: "demo.flows.hospital.s1d", href: "/enter" },
      { labelKey: "demo.flows.hospital.s2", descKey: "demo.flows.hospital.s2d", href: "/" },
      { labelKey: "demo.flows.hospital.s3", descKey: "demo.flows.hospital.s3d", href: "/assistant" },
      { labelKey: "demo.flows.hospital.s4", descKey: "demo.flows.hospital.s4d", href: "/marketplace" },
      { labelKey: "demo.flows.hospital.s5", descKey: "demo.flows.hospital.s5d", href: "/rfq" },
      { labelKey: "demo.flows.hospital.s6", descKey: "demo.flows.hospital.s6d", href: "/offers" },
      { labelKey: "demo.flows.hospital.s7", descKey: "demo.flows.hospital.s7d", href: "/finance" },
      { labelKey: "demo.flows.hospital.s8", descKey: "demo.flows.hospital.s8d", href: "/data-room" },
      { labelKey: "demo.flows.hospital.s9", descKey: "demo.flows.hospital.s9d", href: "/orders" },
    ],
  },
  {
    id: "robotics",
    titleKey: "demo.flows.robotics.title",
    subtitleKey: "demo.flows.robotics.subtitle",
    role: "customer",
    industry: "Hospitality",
    vertical: "robotics",
    steps: [
      { labelKey: "demo.flows.robotics.s1", descKey: "demo.flows.robotics.s1d", href: "/enter" },
      { labelKey: "demo.flows.robotics.s2", descKey: "demo.flows.robotics.s2d", href: "/" },
      { labelKey: "demo.flows.robotics.s3", descKey: "demo.flows.robotics.s3d", href: "/marketplace" },
      { labelKey: "demo.flows.robotics.s4", descKey: "demo.flows.robotics.s4d", href: "/marketplace" },
      { labelKey: "demo.flows.robotics.s5", descKey: "demo.flows.robotics.s5d", href: "/finance" },
      { labelKey: "demo.flows.robotics.s6", descKey: "demo.flows.robotics.s6d", href: "/service-network" },
      { labelKey: "demo.flows.robotics.s7", descKey: "demo.flows.robotics.s7d", href: "/checkout" },
      { labelKey: "demo.flows.robotics.s8", descKey: "demo.flows.robotics.s8d", href: "/network-map" },
      { labelKey: "demo.flows.robotics.s9", descKey: "demo.flows.robotics.s9d", href: "/training" },
    ],
  },
  {
    id: "growth",
    titleKey: "demo.flows.growth.title",
    subtitleKey: "demo.flows.growth.subtitle",
    role: "admin",
    vertical: "medical",
    steps: [
      { labelKey: "demo.flows.growth.s1", descKey: "demo.flows.growth.s1d", href: "/enter" },
      { labelKey: "demo.flows.growth.s2", descKey: "demo.flows.growth.s2d", href: "/admin/growth" },
      { labelKey: "demo.flows.growth.s3", descKey: "demo.flows.growth.s3d", href: "/admin/growth" },
      { labelKey: "demo.flows.growth.s4", descKey: "demo.flows.growth.s4d", href: "/admin/growth" },
      { labelKey: "demo.flows.growth.s5", descKey: "demo.flows.growth.s5d", href: "/admin/growth" },
      { labelKey: "demo.flows.growth.s6", descKey: "demo.flows.growth.s6d", href: "/admin/growth" },
      { labelKey: "demo.flows.growth.s7", descKey: "demo.flows.growth.s7d", href: "/admin/sales-partners" },
      { labelKey: "demo.flows.growth.s8", descKey: "demo.flows.growth.s8d", href: "/rfq" },
      { labelKey: "demo.flows.growth.s9", descKey: "demo.flows.growth.s9d", href: "/admin/sourcing-desk" },
      { labelKey: "demo.flows.growth.s10", descKey: "demo.flows.growth.s10d", href: "/network-map" },
    ],
  },
];
