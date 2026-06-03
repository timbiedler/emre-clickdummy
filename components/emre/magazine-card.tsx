"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, BarChart3, FileText } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { useApp } from "@/context/app-context";
import { t } from "@/lib/i18n";
import type { MagazineItem } from "@/data/types";

const typeIcons = {
  article: FileText,
  video: Play,
  case_study: BookOpen,
  guide: BookOpen,
  comparison: BarChart3,
};

export function MagazineCard({
  item,
  onClick,
}: {
  item: MagazineItem;
  onClick: () => void;
}) {
  const { language } = useApp();
  const Icon = typeIcons[item.type];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass-panel rounded-xl overflow-hidden cursor-pointer group hover:border-cyan-500/30 transition-all"
    >
      <div
        className={`h-32 bg-gradient-to-br ${item.imageGradient} flex items-center justify-center`}
      >
        <Icon className="size-10 text-white/30 group-hover:text-white/50 transition-colors" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <StatusBadge variant="info">{item.type.replace("_", " ")}</StatusBadge>
          <span className="text-xs text-muted-foreground">{item.readTime}</span>
        </div>
        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {t(item.title, language)}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {t(item.excerpt, language)}
        </p>
      </div>
    </motion.div>
  );
}
