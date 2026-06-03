"use client";

import { Stethoscope, Bot } from "lucide-react";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import type { Vertical } from "@/data/types";
import { useUi } from "@/lib/ui-i18n";

export function VerticalSwitcher({ className }: { className?: string }) {
  const { vertical, setVertical } = useApp();
  const { t } = useUi();

  const options: { id: Vertical; labelKey: string; icon: typeof Stethoscope }[] = [
    { id: "medical", labelKey: "vertical.medical", icon: Stethoscope },
    { id: "robotics", labelKey: "vertical.robotics", icon: Bot },
  ];

  return (
    <div className={cn("inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1", className)}>
      {options.map(({ id, labelKey, icon: Icon }) => (
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
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
