"use client";

import { Star, MapPin, Clock, Shield } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { TranslationBadge } from "./translation-badge";
import { useApp } from "@/context/app-context";
import { t } from "@/lib/i18n";
import type { Supplier } from "@/data/types";

export function SupplierProfileCard({
  supplier,
  onClick,
}: {
  supplier: Supplier;
  onClick?: () => void;
}) {
  const { language } = useApp();

  return (
    <div
      onClick={onClick}
      className="surface-card rounded-xl p-5 cursor-pointer hover:border-blue-300 transition-all space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{supplier.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="size-3" /> {supplier.country}
          </p>
        </div>
        <StatusBadge
          variant={supplier.onboardingStatus === "approved" ? "success" : "warning"}
        >
          {supplier.onboardingStatus}
        </StatusBadge>
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2">
        {t(supplier.description, language)}
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-semibold flex items-center justify-center gap-1">
            <Star className="size-4 text-amber-600" />
            {supplier.rating.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{supplier.products}</p>
          <p className="text-xs text-muted-foreground">Products</p>
        </div>
        <div>
          <p className="text-lg font-semibold flex items-center justify-center gap-1">
            <Shield className="size-4 text-emerald-600" />
            {supplier.complianceScore}%
          </p>
          <p className="text-xs text-muted-foreground">Compliance</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3" /> Response: {supplier.responseTime}
        </span>
        <TranslationBadge status={supplier.translationStatus} />
      </div>
    </div>
  );
}
