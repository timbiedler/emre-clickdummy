"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  onClick,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  accent?: "blue" | "green" | "violet" | "slate";
}) {
  const accentColors = {
    blue: "border-blue-100 bg-blue-50/40",
    violet: "border-violet-100 bg-violet-50/40",
    green: "border-emerald-100 bg-emerald-50/40",
    slate: "border-slate-200 bg-white",
  };

  const iconColors = {
    blue: "text-blue-600",
    violet: "text-violet-600",
    green: "text-emerald-600",
    slate: "text-slate-500",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "surface-card rounded-xl p-5",
        accentColors[accent],
        onClick && "cursor-pointer hover:border-blue-200 transition-colors"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {Icon && <Icon className={cn("size-4", iconColors[accent])} />}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
      {change !== undefined && (
        <div
          className={cn(
            "mt-1.5 flex items-center gap-1 text-xs font-medium",
            change >= 0 ? "text-emerald-600" : "text-red-600"
          )}
        >
          {change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      )}
    </div>
  );
}
