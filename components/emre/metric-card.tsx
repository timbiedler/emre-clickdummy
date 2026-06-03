"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  onClick,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  accent?: "cyan" | "violet" | "green" | "blue";
}) {
  const accentColors = {
    cyan: "from-cyan-500/20 to-blue-600/10 border-cyan-500/20",
    violet: "from-violet-500/20 to-fuchsia-600/10 border-violet-500/20",
    green: "from-emerald-500/20 to-teal-600/10 border-emerald-500/20",
    blue: "from-blue-500/20 to-indigo-600/10 border-blue-500/20",
  };

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={cn(
        "glass-panel rounded-xl p-4 bg-gradient-to-br",
        accentColors[accent],
        onClick && "cursor-pointer hover:border-cyan-500/40 transition-colors"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {Icon && <Icon className="size-4 text-cyan-400/70" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {change !== undefined && (
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            change >= 0 ? "text-emerald-400" : "text-red-400"
          )}
        >
          {change >= 0 ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      )}
    </motion.div>
  );
}
