"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, UserCircle } from "lucide-react";
import { useApp } from "@/context/app-context";
import { getHomeForRole } from "@/data/roles";
import type { UserRole } from "@/data/types";
import { useUi } from "@/lib/ui-i18n";
import { useRouter } from "next/navigation";

const roles: UserRole[] = [
  "admin",
  "customer",
  "supplier",
  "dealer",
  "sales_partner",
  "service_partner",
  "finance_partner",
  "agency",
  "logistics",
];

export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const { role, switchRole } = useApp();
  const { t } = useUi();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-slate-200 max-w-[200px]">
          <UserCircle className="size-4 text-blue-600 shrink-0" />
          {!compact && (
            <span className="truncate text-xs">{t(`roles.${role}`)}</span>
          )}
          <ChevronDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {roles.map((r) => (
          <DropdownMenuItem
            key={r}
            onClick={() => {
              switchRole(r);
              router.replace(getHomeForRole(r));
            }}
            className={role === r ? "bg-blue-50 text-blue-700" : ""}
          >
            {t(`roles.${r}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
