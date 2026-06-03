"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Sparkles,
  FileText,
  Tag,
  Newspaper,
  CreditCard,
  Package,
  MapPin,
  User,
  FolderLock,
  Truck,
  Shield,
  Bell,
  Search,
} from "lucide-react";
import { EMRE_NAME, NAV_ITEMS } from "@/data/constants";
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
  MapPin,
  User,
  FolderLock,
  Truck,
  Shield,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center font-bold text-sm">
              E
            </div>
            <div>
              <p className="font-bold tracking-tight gradient-text">{EMRE_NAME}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                European Medical & Robotics Engine
              </p>
            </div>
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-cyan-500/15 text-cyan-300 shadow-[inset_3px_0_0_#22d3ee]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 text-[10px] text-muted-foreground">
          EU B2B Commerce Infrastructure
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
            <div className="lg:hidden flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center font-bold text-xs">
                E
              </div>
              <span className="font-bold gradient-text">{EMRE_NAME}</span>
            </div>
            <div className="hidden md:block flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search EMRE platform…"
                className="pl-9 glass-panel border-white/10 h-9"
              />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <VerticalSwitcher />
              <LanguageSwitcher />
              <button className="relative glass-panel rounded-lg p-2 border-white/10">
                <Bell className="size-4" />
                <Badge className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-[10px] bg-cyan-500 text-black">
                  3
                </Badge>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
