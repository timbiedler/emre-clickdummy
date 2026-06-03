"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/ui-i18n";

export function EmptyResultsPanel({
  onClearFilters,
  showSourcingLink = true,
  showRfqLink = true,
}: {
  onClearFilters?: () => void;
  showSourcingLink?: boolean;
  showRfqLink?: boolean;
}) {
  const { t } = useUi();

  return (
    <div className="surface-card rounded-xl p-8 text-center space-y-4 border border-slate-200">
      <SearchX className="size-10 text-slate-300 mx-auto" />
      <p className="text-sm font-medium text-slate-900">{t("empty.noResults")}</p>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">{t("empty.noResultsHint")}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            {t("empty.clearFilters")}
          </Button>
        )}
        {showSourcingLink && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/sourcing-desk">{t("sourcing.createGapRequest")}</Link>
          </Button>
        )}
        {showRfqLink && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/rfq">{t("rfq.createRfq")}</Link>
          </Button>
        )}
        <Button size="sm" variant="ghost" asChild>
          <Link href="/search">{t("empty.searchAll")}</Link>
        </Button>
      </div>
    </div>
  );
}
