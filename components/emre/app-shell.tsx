"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Sparkles,
  FileText,
  Tag,
  Newspaper,
  CreditCard,
  Package,
  Wrench,
  Globe,
  User,
  FolderLock,
  Truck,
  Shield,
  Bell,
  Search,
  Handshake,
  Users,
  Briefcase,
  Warehouse,
  Megaphone,
  Receipt,
  ClipboardList,
  UserCog,
} from "lucide-react";
import { PRODUCT_NAME_LINE1, PRODUCT_NAME_LINE2 } from "@/data/constants";
import { getNavForRole } from "@/data/roles";
import { VerticalSwitcher } from "./vertical-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { RoleSwitcher } from "./role-switcher";
import { IndustrySelector } from "./industry-selector";
import { ConsultationDrawer } from "./consultation-drawer";
import { useApp } from "@/context/app-context";
import { useUi } from "@/lib/ui-i18n";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { NavIconName } from "@/data/roles";

const iconMap: Record<NavIconName, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Store,
  Sparkles,
  FileText,
  Tag,
  Newspaper,
  CreditCard,
  Package,
  Wrench,
  Globe,
  User,
  FolderLock,
  Truck,
  Shield,
  Handshake,
  Users,
  Briefcase,
  Warehouse,
  Megaphone,
  Receipt,
  ClipboardList,
  UserCog,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, currentUserName, resetWorkspace } = useApp();
  const { t } = useUi();
  const navItems = getNavForRole(role);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white shrink-0">
        <div className="px-5 py-6 border-b border-slate-200">
          <Link href={navItems[0]?.href ?? "/"} className="leading-tight block">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">
              {PRODUCT_NAME_LINE1}
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              {PRODUCT_NAME_LINE2}
            </p>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "nav-active"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              resetWorkspace();
              router.push("/enter");
            }}
            className="text-xs text-slate-500 hover:text-blue-600"
          >
            {t("common.switchRole")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 h-14 flex-wrap">
            <div className="lg:hidden leading-tight mr-auto">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                {PRODUCT_NAME_LINE1}
              </p>
              <p className="text-sm font-semibold text-slate-900">{PRODUCT_NAME_LINE2}</p>
            </div>
            <div className="hidden md:block flex-1 max-w-sm relative min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder={t("common.search")}
                className="pl-9 h-9 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              <RoleSwitcher compact />
              <IndustrySelector compact />
              <VerticalSwitcher />
              <LanguageSwitcher />
              <button
                type="button"
                className="relative rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50"
              >
                <Bell className="size-4 text-slate-600" />
                <Badge className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-[10px] bg-blue-600 text-white border-0">
                  3
                </Badge>
              </button>
              <div
                className="hidden sm:flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700"
                title={currentUserName}
              >
                {currentUserName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
      <ConsultationDrawer />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  titleKey,
  descriptionKey,
  action,
}: {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  action?: React.ReactNode;
}) {
  const { t } = useUi();
  const displayTitle = titleKey ? t(titleKey) : title ?? "";
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{displayTitle}</h1>
        {displayDescription && (
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">{displayDescription}</p>
        )}
      </div>
      {action}
    </div>
  );
}
