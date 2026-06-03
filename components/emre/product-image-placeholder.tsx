import {
  Stethoscope,
  Bot,
  Microscope,
  Shield,
  Box,
  FlaskConical,
  HeartPulse,
  Droplets,
  Siren,
  BedDouble,
  Activity,
  Wind,
  Bandage,
  Sparkles,
  Warehouse,
  ScanSearch,
  Wrench,
  Battery,
  Radio,
  Brush,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/types";

const medicalIcons: Record<string, typeof Stethoscope> = {
  Diagnostics: Microscope,
  PPE: Shield,
  Consumables: Box,
  Laboratory: FlaskConical,
  "Medical Devices": HeartPulse,
  Hygiene: Droplets,
  "Emergency Supply": Siren,
  "Care Equipment": BedDouble,
  Monitoring: Activity,
  Respiratory: Wind,
  "Wound Care": Bandage,
  Sterilization: Sparkles,
};

const roboticsIcons: Record<string, typeof Bot> = {
  "Cleaning Robots": Bot,
  "Security Robots": Shield,
  "Hospitality Robots": Headphones,
  "Garden Robots": Sparkles,
  "Agricultural Robots": ScanSearch,
  "Warehouse Robots": Warehouse,
  "Inspection Robots": ScanSearch,
  "Spare Parts": Wrench,
  Batteries: Battery,
  Sensors: Radio,
  Brushes: Brush,
  "Service Packages": Headphones,
};

export function ProductImagePlaceholder({
  product,
  className,
  size = "md",
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon =
    product.vertical === "medical"
      ? medicalIcons[product.category] ?? Stethoscope
      : roboticsIcons[product.category] ?? Bot;

  const sizes = {
    sm: { icon: "size-8", label: "text-[10px]", brand: "text-xs" },
    md: { icon: "size-12", label: "text-xs", brand: "text-sm" },
    lg: { icon: "size-16", label: "text-sm", brand: "text-base" },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-gradient-to-br border-b border-slate-100 overflow-hidden",
        product.imageGradient,
        className
      )}
    >
      <div className="absolute top-2 left-2 rounded-md bg-white/90 border border-slate-200 px-2 py-0.5">
        <span className={cn("font-medium text-slate-600", s.label)}>
          {product.imageLabel}
        </span>
      </div>
      <Icon className={cn(s.icon, "text-slate-300 mb-2")} />
      <span className={cn("font-medium text-slate-400 tracking-wide", s.brand)}>
        {product.brand}
      </span>
    </div>
  );
}
