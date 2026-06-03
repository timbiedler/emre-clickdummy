import { cn } from "@/lib/utils";
import type { RelevanceBadgeType } from "@/lib/industry-relevance";

const styles: Record<RelevanceBadgeType, string> = {
  recommended: "bg-blue-50 text-blue-700 border-blue-200",
  often_purchased: "bg-emerald-50 text-emerald-700 border-emerald-200",
  facility: "bg-slate-100 text-slate-700 border-slate-200",
  outdoor: "bg-amber-50 text-amber-800 border-amber-200",
  service_region: "bg-orange-50 text-orange-700 border-orange-200",
  leasing: "bg-violet-50 text-violet-700 border-violet-200",
  frequently_leased: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ai_recommended: "bg-blue-50 text-blue-800 border-blue-200",
};

export function RelevanceBadge({
  label,
  type = "recommended",
  className,
}: {
  label: string;
  type?: RelevanceBadgeType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium leading-tight",
        styles[type],
        className
      )}
    >
      {label}
    </span>
  );
}
