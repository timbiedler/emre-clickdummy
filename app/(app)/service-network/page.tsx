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
import type { Servicepoint } from "@/data/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ServiceNetworkPage() {
  const { vertical } = useApp();
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
        title="Service Network"
        description={
          vertical === "medical"
            ? "Service partners, compliance contacts, and emergency supply coverage across Europe."
            : "Installation partners, spare parts hubs, and fleet service centers for robotics deployments."
        }
        action={
          <Link href="/network-map">
            <Button variant="outline">Open Network Map</Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="surface-card rounded-xl p-5 space-y-4 h-fit">
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Country</Label>
            {["all", ...COUNTRIES.slice(0, 6)].map((c) => (
              <div key={c} className="flex items-center gap-2">
                <Checkbox
                  checked={countryFilter === c}
                  onCheckedChange={() => setCountryFilter(c)}
                />
                <Label className="text-xs cursor-pointer text-slate-700">
                  {c === "all" ? "All Countries" : c}
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
