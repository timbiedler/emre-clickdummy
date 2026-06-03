"use client";

import { useState } from "react";
import { MapPin, Wrench, Clock, Star } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/emre/app-shell";
import { ServicepointCard } from "@/components/emre/servicepoint-card";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { servicepoints } from "@/data/servicepoints";
import { COUNTRIES } from "@/data/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUi } from "@/lib/ui-i18n";
import type { Servicepoint } from "@/data/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function ServiceNetworkPage() {
  const { vertical } = useApp();
  const { t, countryName } = useUi();
  const [selected, setSelected] = useState<Servicepoint | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const points = servicepoints.filter(
    (p) =>
      p.vertical === vertical &&
      (countryFilter === "all" || p.country === countryFilter)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="service.title"
        descriptionKey="service.subtitle"
        action={
          <Link href="/network-map">
            <Button variant="outline">{t("nav.networkMap")}</Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="surface-card rounded-xl p-5 space-y-4 h-fit">
          <p className="text-sm font-semibold text-slate-900">{t("common.filters")}</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <Label className="text-xs text-slate-500">{t("marketplace.country")}</Label>
            {["all", ...COUNTRIES].map((c) => (
              <div key={c} className="flex items-center gap-2">
                <Checkbox
                  checked={countryFilter === c}
                  onCheckedChange={() => setCountryFilter(c)}
                />
                <Label className="text-xs cursor-pointer text-slate-700">
                  {c === "all" ? t("networkMap.allCountries") : countryName(c as typeof COUNTRIES[number])}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {points.map((point) => (
            <ServicepointCard key={point.id} point={point} onClick={() => setSelected(point)} />
          ))}
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="surface-card-elevated">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <StatusBadge variant="info">{selected.type}</StatusBadge>
                <p className="text-sm flex items-center gap-2 text-slate-600">
                  <MapPin className="size-4 text-slate-400" />
                  {selected.region}, {selected.country}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selected.categories.map((c) => (
                    <StatusBadge key={c}>{c}</StatusBadge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.serviceTypes.map((s) => (
                    <StatusBadge key={s} variant="violet">
                      <Wrench className="size-3 mr-1" />
                      {s}
                    </StatusBadge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" /> {selected.responseTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-4 text-amber-500" /> {selected.rating.toFixed(1)}
                  </span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {vertical === "robotics" ? "Book Technician" : "Contact Partner"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
