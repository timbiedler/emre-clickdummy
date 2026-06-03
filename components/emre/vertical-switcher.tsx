"use client";

import { Stethoscope, Bot } from "lucide-react";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import type { Vertical } from "@/data/types";

export function VerticalSwitcher({ className }: { className?: string }) {
  const { vertical, setVertical } = useApp();

  const options: { id: Vertical; label: string; icon: typeof Stethoscope }[] = [
    { id: "medical", label: "Medical", icon: Stethoscope },
    { id: "robotics", label: "Robotics", icon: Bot },
  ];

  return (
    <div
      className={cn(
        "inline-flex rounded-xl glass-panel p-1 gap-1",
        className
      )}
    >
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setVertical(id)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            vertical === id
              ? id === "medical"
                ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                : "bg-violet-500/20 text-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
