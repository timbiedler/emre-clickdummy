"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { useApp } from "@/context/app-context";
import { COUNTRIES } from "@/data/constants";
import { getConsultationUseCases } from "@/lib/product-ai";
import { getProductFinance } from "@/lib/product-finance";
import { getProducts } from "@/data";
import { formatCurrency } from "@/lib/format";

const budgets = ["€5k – €25k", "€25k – €100k", "€100k – €500k", "€500k+"];

export function ConsultationDrawer() {
  const { vertical, consultationOpen, closeConsultation, consultationProductId } =
    useApp();
  const [useCase, setUseCase] = useState("");
  const [budget, setBudget] = useState(budgets[1]);
  const [country, setCountry] = useState("Germany");
  const [buyerType, setBuyerType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const useCases = getConsultationUseCases(vertical);
  const product = consultationProductId
    ? getProducts(vertical).find((p) => p.id === consultationProductId)
    : null;
  const finance = product ? getProductFinance(product) : null;

  const buyerTypes =
    vertical === "medical"
      ? ["Hospital", "Care Group", "Laboratory", "Public Sector", "Distributor"]
      : ["Hotel Group", "Cleaning Company", "Dealer", "Facility Manager", "Industrial"];

  const deploymentScenarios =
    vertical === "medical"
      ? ["Single site", "Multi-site rollout", "Emergency procurement", "Framework contract"]
      : ["Single property", "Multi-country fleet", "Showroom demo", "Service fleet expansion"];

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <Sheet open={consultationOpen} onOpenChange={(v) => !v && closeConsultation()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-violet-600" />
            Sales Consultation Request
          </SheetTitle>
        </SheetHeader>

        {submitted ? (
          <div className="mt-8 space-y-4 text-center">
            <StatusBadge variant="success">Consultation queued</StatusBadge>
            <p className="text-sm text-muted-foreground">
              A sales advisor will respond within 4 hours with product, leasing, and
              deployment recommendations.
            </p>
            {finance && (
              <div className="surface-card rounded-lg p-4 text-sm">
                Preliminary leasing estimate:{" "}
                <span className="font-semibold text-accent-green">
                  {formatCurrency(finance.leasingRateMonthly)}/mo
                </span>
              </div>
            )}
            <Button onClick={closeConsultation}>Close</Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {product && (
              <div className="surface-card rounded-lg p-3 text-sm">
                <p className="text-xs text-muted-foreground">Selected product</p>
                <p className="font-medium">{product.name.en}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs">Industry Use Case</Label>
              <Select value={useCase} onValueChange={setUseCase}>
                <SelectTrigger className="surface-card border-slate-200">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent className="surface-card-elevated border-slate-200">
                  {useCases.map((uc) => (
                    <SelectItem key={uc} value={uc}>
                      {uc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Budget Range</Label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="surface-card border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="surface-card-elevated border-slate-200">
                    {budgets.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="surface-card border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="surface-card-elevated border-slate-200">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Buyer Type</Label>
                <Select value={buyerType} onValueChange={setBuyerType}>
                  <SelectTrigger className="surface-card border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="surface-card-elevated border-slate-200">
                    {buyerTypes.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Deployment Scenario</Label>
                <Select>
                  <SelectTrigger className="surface-card border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="surface-card-elevated border-slate-200">
                    {deploymentScenarios.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="surface-card border-slate-200 resize-none text-sm"
                placeholder="Describe volume, timeline, financing preference…"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {useCases.slice(0, 3).map((uc) => (
                <button
                  key={uc}
                  type="button"
                  onClick={() => setUseCase(uc)}
                  className="text-left text-xs surface-card rounded-lg px-3 py-2 hover:border-blue-300 transition-colors"
                >
                  {uc}
                </button>
              ))}
            </div>

            <Button
              className="w-full gap-2 bg-gradient-to-r from-violet-600 to-cyan-600"
              onClick={handleSubmit}
            >
              <Send className="size-4" /> Book Sales Consultation
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
