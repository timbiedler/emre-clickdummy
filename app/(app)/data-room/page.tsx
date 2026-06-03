"use client";

import { useState } from "react";
import { Upload, Shield } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import {
  DataRoomUploadCard,
  FinanceReadinessScore,
} from "@/components/emre/data-room-upload-card";
import { TranslationExamplesPanel } from "@/components/emre/translation-examples-panel";
import { TrustStrip } from "@/components/emre/trust-strip";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { dataRoomDocuments } from "@/data/data-room";
import type { DataRoomDocument } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function DataRoomPage() {
  const { vertical, showToast } = useApp();
  const [selected, setSelected] = useState<DataRoomDocument | null>(null);
  const docs = dataRoomDocuments.filter((d) => d.vertical === vertical);
  const verified = docs.filter((d) => d.status === "verified").length;
  const score = Math.round((verified / docs.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="nav.dataRoom"
        descriptionKey="finance.dataRoomReadiness"
        action={
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => showToast("Document uploaded securely — verification queued (mock)")}
          >
            <Upload className="size-4" /> Upload Document
          </Button>
        }
      />

      <TrustStrip />

      <div className="grid lg:grid-cols-3 gap-6">
        <FinanceReadinessScore score={score} />
        <div className="lg:col-span-2 surface-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-emerald-600" />
            <h3 className="font-semibold">Document Status Overview</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            {(["verified", "uploaded", "missing", "rejected"] as const).map((s) => (
              <div key={s} className="surface-card rounded-lg p-3">
                <p className="text-xl font-bold">{docs.filter((d) => d.status === s).length}</p>
                <StatusBadge variant={s === "verified" ? "success" : s === "missing" ? "danger" : "warning"}>
                  {s}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <DataRoomUploadCard
            key={doc.id}
            doc={doc}
            onClick={() => setSelected(doc)}
            onUpload={() => showToast("Document uploaded securely — verification queued (mock)")}
          />
        ))}
      </div>

      <TranslationExamplesPanel />

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="surface-card-elevated border-slate-200">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Row label="Category" value={selected.category} />
                <Row label="Status" value={selected.status} />
                <Row label="Required" value={selected.required ? "Yes" : "No"} />
                {selected.uploadedAt && <Row label="Uploaded" value={selected.uploadedAt} />}
                {selected.status === "missing" && (
                  <Button className="w-full gap-2">
                    <Upload className="size-4" /> Upload Document
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between surface-card rounded-lg p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
