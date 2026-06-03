"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown } from "lucide-react";
import { useApp } from "@/context/app-context";
import { INDUSTRIES, INDUSTRY_SHORT } from "@/data/industries";

export function IndustrySelector({ compact }: { compact?: boolean }) {
  const { industry, setIndustry } = useApp();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-slate-200 max-w-[180px]">
          <Building2 className="size-4 text-slate-500 shrink-0" />
          {!compact && (
            <span className="truncate text-xs">
              {INDUSTRY_SHORT[industry] ?? industry}
            </span>
          )}
          <ChevronDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto w-64">
        {INDUSTRIES.map((ind) => (
          <DropdownMenuItem
            key={ind}
            onClick={() => setIndustry(ind)}
            className={industry === ind ? "bg-blue-50 text-blue-700" : ""}
          >
            {ind}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
