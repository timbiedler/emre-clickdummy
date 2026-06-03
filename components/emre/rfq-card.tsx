"use client";

import { motion } from "framer-motion";
import { Clock, Users, FileText, Sparkles } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { TranslationBadge } from "./translation-badge";
import { useApp } from "@/context/app-context";
import { t } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RFQ } from "@/data/types";

const statusVariant = {
  draft: "default" as const,
  active: "info" as const,
  matching: "warning" as const,
  offers_received: "success" as const,
  closed: "default" as const,
};

export function RFQCard({ rfq, onClick }: { rfq: RFQ; onClick: () => void }) {
  const { language } = useApp();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="surface-card rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-all space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground font-mono">{rfq.rfqNumber ?? rfq.id.toUpperCase()}</p>
          <h3 className="font-medium mt-1">{t(rfq.title, language)}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge variant={statusVariant[rfq.status]}>
            {rfq.status.replace("_", " ")}
          </StatusBadge>
          <StatusBadge variant="violet">
            <Sparkles className="size-3 mr-1" /> AI
          </StatusBadge>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="size-3" /> Qty: {rfq.quantity.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> Due: {formatDate(rfq.deadline)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3" /> {rfq.matchedSuppliers} matched
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent-blue">
          Budget: {formatCurrency(rfq.budget)}
        </span>
        <TranslationBadge status={rfq.translationStatus} />
      </div>
    </motion.div>
  );
}
