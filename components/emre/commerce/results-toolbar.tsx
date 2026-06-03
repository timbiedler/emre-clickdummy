"use client";

import { PaginationControls } from "./pagination-controls";
import { PageSizeSelect } from "./page-size-select";

export function ResultsToolbar({
  from,
  to,
  total,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showingLabel,
  pageSizeLabel,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  showingLabel: string;
  pageSizeLabel: string;
}) {
  if (total === 0) return null;

  const label = showingLabel
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{total}", String(total));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
      <p className="text-sm text-slate-600">{label}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <PageSizeSelect value={pageSize} onChange={onPageSizeChange} label={pageSizeLabel} />
        <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
