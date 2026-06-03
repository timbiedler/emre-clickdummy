import type { Country, Language } from "./types";

export const PRODUCT_NAME_LINE1 = "DISTRIBUTION";
export const PRODUCT_NAME_LINE2 = "ENGINE";
export const PRODUCT_NAME = "DISTRIBUTION ENGINE";
export const DEMO_BASE_URL = "https://distribution-engine-demo.vercel.app";

export const LANGUAGES: { code: Language; label: string; flag: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", flag: "🇵🇱" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", flag: "🇳🇱" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska", flag: "🇸🇪" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi", flag: "🇫🇮" },
  { code: "no", label: "Norwegian", nativeLabel: "Norsk", flag: "🇳🇴" },
  { code: "et", label: "Estonian", nativeLabel: "Eesti", flag: "🇪🇪" },
  { code: "lv", label: "Latvian", nativeLabel: "Latviešu", flag: "🇱🇻" },
  { code: "lt", label: "Lithuanian", nativeLabel: "Lietuvių", flag: "🇱🇹" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
];

export const COUNTRIES: Country[] = [
  "Germany",
  "Austria",
  "Switzerland",
  "Netherlands",
  "Belgium",
  "France",
  "Spain",
  "Italy",
  "Poland",
  "Czech Republic",
  "Slovakia",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Norway",
  "Finland",
  "Sweden",
  "Denmark",
  "Estonia",
  "Latvia",
  "Lithuania",
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

export const CARD_GRADIENTS = [
  "from-slate-100 to-slate-50",
  "from-blue-50 to-slate-50",
  "from-emerald-50 to-slate-50",
  "from-slate-50 to-blue-50",
  "from-slate-100 to-blue-50",
  "from-slate-50 to-emerald-50",
];