"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Country } from "@/data/types";
import type { GlobalSearchResult } from "@/lib/global-search";
import { useUi } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";

export function SearchResultRow({
  result,
  onSelect,
  compact,
}: {
  result: GlobalSearchResult;
  onSelect: (r: GlobalSearchResult) => void;
  compact?: boolean;
}) {
  const { t, countryName } = useUi();

  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className={cn(
        "w-full text-left rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors px-3 py-2.5 group",
        compact && "py-2"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-900 truncate">{result.title}</span>
            <Badge variant="outline" className="text-[10px] font-normal shrink-0">
              {t(result.badgeKey)}
            </Badge>
            {result.status && (
              <span className="text-[10px] text-slate-500 capitalize">{result.status}</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{result.description}</p>
          {(result.country || result.industry || result.vertical) && (
            <p className="text-[10px] text-slate-400 mt-1">
              {[
                result.vertical && result.vertical !== "combined" ? result.vertical : null,
                result.country ? countryName(result.country as Country) : result.country,
                result.industry,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        {result.quickActionKey && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 opacity-0 group-hover:opacity-100 h-7 text-xs gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(result);
            }}
          >
            {t(result.quickActionKey)}
            <ArrowRight className="size-3" />
          </Button>
        )}
        {!result.quickActionKey && (
          <ExternalLink className="size-3.5 text-slate-300 shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    </button>
  );
}
