"use client";

import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function AppToast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-[100] -translate-x-1/2",
        "flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg",
        "text-sm font-medium text-slate-800 animate-in fade-in slide-in-from-bottom-2"
      )}
      role="status"
    >
      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
      {toast}
    </div>
  );
}
