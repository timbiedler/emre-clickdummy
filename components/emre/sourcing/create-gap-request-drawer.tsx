"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSourcing } from "@/context/sourcing-context";
import { useUi } from "@/lib/ui-i18n";
import { useState } from "react";
import type { CreateGapRequestInput } from "@/data/sourcing-types";

function GapRequestForm({
  prefill,
  onClose,
}: {
  prefill: CreateGapRequestInput | null;
  onClose: () => void;
}) {
  const { t } = useUi();
  const { createProductGapRequest, setSelectedRequestId } = useSourcing();
  const [product, setProduct] = useState(prefill?.requestedProduct ?? "");
  const [notes, setNotes] = useState(prefill?.notes ?? prefill?.aiPrompt ?? "");

  const handleSubmit = () => {
    const input: CreateGapRequestInput = {
      ...prefill,
      requestedProduct: product || prefill?.requestedProduct || "Unspecified product",
      notes,
      source: prefill?.source ?? "marketplace_search",
    };
    const req = createProductGapRequest(input);
    setSelectedRequestId(req.id);
    onClose();
  };

  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs text-slate-500">{t("sourcing.gapRequestHint")}</p>
      <div className="space-y-2">
        <Label className="text-xs">{t("sourcing.requestedProduct")}</Label>
        <Input value={product} onChange={(e) => setProduct(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">{t("sourcing.notes")}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder={t("sourcing.notesPlaceholder")}
        />
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
        {t("sourcing.submitGapRequest")}
      </Button>
    </div>
  );
}

export function CreateGapRequestDrawer() {
  const { t } = useUi();
  const { gapDrawerOpen, setGapDrawerOpen, gapDrawerPrefill } = useSourcing();
  const formKey = gapDrawerPrefill?.requestedProduct ?? "new";

  return (
    <Sheet
      open={gapDrawerOpen}
      onOpenChange={(v) => {
        if (!v) setGapDrawerOpen(false);
      }}
    >
      <SheetContent className="surface-card-elevated border-slate-200 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("sourcing.createGapRequest")}</SheetTitle>
        </SheetHeader>
        {gapDrawerOpen && (
          <GapRequestForm
            key={formKey}
            prefill={gapDrawerPrefill}
            onClose={() => setGapDrawerOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
