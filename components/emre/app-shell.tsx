"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { PRODUCT_NAME_LINE1, PRODUCT_NAME_LINE2, NAV_ITEMS } from "@/data/constants";
import { VerticalSwitcher } from "./vertical-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { ConsultationDrawer } from "./consultation-drawer";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const iconMap = {
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
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white shrink-0">
        <div className="px-5 py-6 border-b border-slate-200">
          <div className="leading-tight">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">
              {PRODUCT_NAME_LINE1}
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              {PRODUCT_NAME_LINE2}
            </p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const active = pathname === item.href;
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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-4 px-4 lg:px-6 h-14">
            <div className="lg:hidden leading-tight">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-500">
                {PRODUCT_NAME_LINE1}
              </p>
              <p className="text-sm font-semibold text-slate-900">{PRODUCT_NAME_LINE2}</p>
            </div>
            <div className="hidden md:block flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search products, orders, partners…"
                className="pl-9 h-9 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-3 ml-auto">
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
              <div className="hidden sm:flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                AK
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
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
