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
    <div className={cn("inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1", className)}>
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setVertical(id)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            vertical === id
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
