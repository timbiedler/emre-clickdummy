import type { Country, Language } from "./types";

export const EMRE_NAME = "EMRE";
export const EMRE_FULL = "European Medical & Robotics Engine";
export const EMRE_SUBTITLE =
  "AI-powered B2B Commerce Infrastructure for Medical Supply & Robotics Distribution";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export const COUNTRIES: Country[] = [
  "Germany",
  "Austria",
  "Switzerland",
  "France",
  "Spain",
  "Italy",
  "Poland",
  "Netherlands",
  "Belgium",
  "Denmark",
  "Sweden",
];

export const MEDICAL_CATEGORIES = [
  "Diagnostics",
  "PPE",
  "Consumables",
  "Laboratory",
  "Medical Devices",
  "Hygiene",
  "Emergency Supply",
  "Care Equipment",
  "Monitoring",
  "Respiratory",
  "Wound Care",
  "Sterilization",
];

export const ROBOTICS_CATEGORIES = [
  "Cleaning Robots",
  "Security Robots",
  "Hospitality Robots",
  "Garden Robots",
  "Agricultural Robots",
  "Warehouse Robots",
  "Inspection Robots",
  "Spare Parts",
  "Batteries",
  "Sensors",
  "Brushes",
  "Service Packages",
];

export const MEDICAL_CHANNELS = [
  "Hospitals",
  "Care Homes",
  "Laboratories",
  "Public Sector",
  "NGOs",
  "Doctor Practices",
  "Test Centers",
  "Distributors",
];

export const ROBOTICS_CHANNELS = [
  "Hospitality",
  "Cleaning Companies",
  "Facility Management",
  "Car Dealerships",
  "Municipalities",
  "Agriculture",
  "Security Companies",
  "Retail",
  "Logistics",
  "Industrial Sites",
];

export const MEDICAL_BRANDS = [
  "MediCore Labs",
  "SafeGuard Medical",
  "EuroDiag Systems",
  "VitalCare Supply",
  "SteriTech EU",
  "NovaMed Instruments",
  "CareLine Pro",
  "LabPrecision",
];

export const ROBOTICS_BRANDS = [
  "RoboClean Industries",
  "Nexus Robotics",
  "AutoServe Systems",
  "FieldBot EU",
  "ServoTech Robotics",
  "AgriScan Robotics",
  "SecurePatrol GmbH",
  "LogiMove Robotics",
];

export const GRADIENTS = [
  "from-cyan-500/40 via-blue-600/30 to-violet-600/40",
  "from-emerald-500/40 via-cyan-600/30 to-blue-600/40",
  "from-violet-500/40 via-fuchsia-600/30 to-cyan-600/40",
  "from-blue-500/40 via-indigo-600/30 to-emerald-600/40",
  "from-teal-500/40 via-cyan-600/30 to-violet-600/40",
  "from-green-500/40 via-emerald-600/30 to-blue-600/40",
];

export const NAV_ITEMS = [
  { href: "/", label: "Command Center", icon: "LayoutDashboard" },
  { href: "/marketplace", label: "Marketplace", icon: "Store" },
  { href: "/assistant", label: "AI Need Assistant", icon: "Sparkles" },
  { href: "/rfq", label: "RFQ Center", icon: "FileText" },
  { href: "/deals", label: "Deals", icon: "Tag" },
  { href: "/magazine", label: "Magazine", icon: "Newspaper" },
  { href: "/finance", label: "Leasing & Finance", icon: "CreditCard" },
  { href: "/orders", label: "Orders & Tracking", icon: "Package" },
  { href: "/service-network", label: "Service Network", icon: "MapPin" },
  { href: "/account", label: "Customer Account", icon: "User" },
  { href: "/data-room", label: "Data Room", icon: "FolderLock" },
  { href: "/supplier", label: "Supplier Portal", icon: "Truck" },
  { href: "/admin", label: "Admin / Operations", icon: "Shield" },
] as const;
