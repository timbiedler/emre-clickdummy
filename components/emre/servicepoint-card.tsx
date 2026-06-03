"use client";

import { MapPin, Clock, Wrench, Star } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { Servicepoint } from "@/data/types";

export function ServicepointCard({
  point,
  onClick,
}: {
  point: Servicepoint;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="surface-card rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-all space-y-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{point.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="size-3" /> {point.region}, {point.country}
          </p>
        </div>
        <StatusBadge variant="info">{point.type}</StatusBadge>
      </div>
      <div className="flex flex-wrap gap-1">
        {point.serviceTypes.map((s) => (
          <StatusBadge key={s} variant="default">
            <Wrench className="size-3 mr-1" />
            {s}
          </StatusBadge>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> {point.responseTime} response
        </span>
        <span className="flex items-center gap-1">
          <Star className="size-3 text-amber-600" /> {point.rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
