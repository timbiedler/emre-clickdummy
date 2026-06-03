"use client";

import { useState } from "react";
import { MapPin, Wrench, Clock, Star } from "lucide-react";
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
            ? "Distributors, compliance contacts, device service partners, and emergency supply partners across the EU."
            : "Dealers, showrooms, spare parts hubs, installation partners, and fleet service centers."
        }
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-xl p-4 space-y-4 h-fit">
          <p className="text-sm font-medium">Filters</p>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Country</Label>
            {["all", ...COUNTRIES.slice(0, 6)].map((c) => (
              <div key={c} className="flex items-center gap-2">
                <Checkbox
                  checked={countryFilter === c}
                  onCheckedChange={() => setCountryFilter(c)}
                />
                <Label className="text-xs cursor-pointer">{c === "all" ? "All Countries" : c}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {points.map((point) => (
            <ServicepointCard key={point.id} point={point} onClick={() => setSelected(point)} />
          ))}
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <MapPin className="size-4 text-cyan-400" /> Network Map
          </p>
          <div className="aspect-square rounded-lg bg-gradient-to-br from-cyan-900/20 to-violet-900/20 border border-white/10 relative overflow-hidden">
            {points.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className="absolute size-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] cursor-pointer hover:scale-150 transition-transform"
                style={{
                  top: `${15 + (i * 11) % 70}%`,
                  left: `${10 + (i * 17) % 75}%`,
                }}
                onClick={() => setSelected(p)}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              EU Service Coverage
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{points.length} servicepoints in selected region</p>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="glass-panel-strong border-white/10">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <StatusBadge variant="info">{selected.type}</StatusBadge>
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="size-4 text-cyan-400" />
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
                      <Wrench className="size-3 mr-1" />{s}
                    </StatusBadge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" /> {selected.responseTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-4 text-amber-400" /> {selected.rating.toFixed(1)}
                  </span>
                </div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500">
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
