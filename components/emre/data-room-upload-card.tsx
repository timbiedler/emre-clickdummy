"use client";

import { Upload, FileCheck, FileX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./status-badge";
import type { DataRoomDocument } from "@/data/types";

const statusConfig = {
  verified: { icon: FileCheck, variant: "success" as const, label: "Verified" },
  uploaded: { icon: Clock, variant: "warning" as const, label: "Under Review" },
  missing: { icon: FileX, variant: "danger" as const, label: "Missing" },
  rejected: { icon: FileX, variant: "danger" as const, label: "Rejected" },
};

export function DataRoomUploadCard({
  doc,
  onClick,
}: {
  doc: DataRoomDocument;
  onClick: () => void;
}) {
  const config = statusConfig[doc.status];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className="glass-panel rounded-xl p-4 cursor-pointer hover:border-cyan-500/30 transition-all space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/5 p-2">
            <Icon className="size-5 text-cyan-400" />
          </div>
          <div>
            <p className="font-medium text-sm">{doc.name}</p>
            <p className="text-xs text-muted-foreground">{doc.category}</p>
          </div>
        </div>
        <StatusBadge variant={config.variant}>{config.label}</StatusBadge>
      </div>
      {doc.status === "missing" && doc.required && (
        <Button size="sm" variant="outline" className="w-full gap-2">
          <Upload className="size-4" /> Upload Document
        </Button>
      )}
      {doc.uploadedAt && (
        <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
      )}
    </div>
  );
}

export function FinanceReadinessScore({ score }: { score: number }) {
  return (
    <div className="glass-panel rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Finance Readiness Score</p>
        <span className="text-2xl font-bold neon-text-green">{score}%</span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground">
        Upload remaining documents to unlock pre-approved financing offers.
      </p>
    </div>
  );
}
