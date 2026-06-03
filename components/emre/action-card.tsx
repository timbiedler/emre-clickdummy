"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionCard({
  title,
  description,
  href,
  secondaryHref,
  secondaryLabel,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card rounded-xl p-5 flex flex-col min-h-[140px] hover:border-blue-200 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {Icon && <Icon className="size-4 text-blue-600 shrink-0" />}
      </div>
      <p className="text-xs text-slate-500 mt-2 flex-1">{description}</p>
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" asChild>
          <Link href={href}>Open</Link>
        </Button>
        {secondaryHref && secondaryLabel && (
          <Button size="sm" variant="outline" className="h-8" asChild>
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
