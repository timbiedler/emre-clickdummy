"use client";

import { useState } from "react";
import { Calculator, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/format";

export function FinanceCalculator({
  defaultPrice = 45000,
}: {
  defaultPrice?: number;
}) {
  const [price, setPrice] = useState(defaultPrice);
  const [term, setTerm] = useState(36);
  const [downPayment, setDownPayment] = useState(5000);
  const [type, setType] = useState("leasing");

  const financed = price - downPayment;
  const monthlyRate = Math.round((financed * 1.08) / term);

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="size-5 text-cyan-400" />
        <h3 className="font-semibold">Finance Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">
            Product Price: {formatCurrency(price)}
          </Label>
          <Slider
            min={5000}
            max={200000}
            step={1000}
            value={[price]}
            onValueChange={([v]) => setPrice(v)}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">
            Down Payment: {formatCurrency(downPayment)}
          </Label>
          <Slider
            min={0}
            max={price * 0.5}
            step={500}
            value={[downPayment]}
            onValueChange={([v]) => setDownPayment(v)}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Term: {term} months</Label>
          <Slider
            min={12}
            max={60}
            step={6}
            value={[term]}
            onValueChange={([v]) => setTerm(v)}
            className="mt-2"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="glass-panel border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-panel-strong border-white/10">
            <SelectItem value="leasing">Leasing</SelectItem>
            <SelectItem value="financing">Financing</SelectItem>
            <SelectItem value="finetrading">Finetrading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-panel-strong rounded-lg p-4 text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase">Estimated Monthly Rate</p>
        <p className="text-3xl font-bold neon-text-green">{formatCurrency(monthlyRate)}</p>
        <p className="text-xs text-muted-foreground">/ month · {term} months</p>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge variant="warning">Documents missing</StatusBadge>
        <Button size="sm" variant="outline" className="gap-2">
          <Upload className="size-4" /> Upload to Data Room
        </Button>
      </div>
    </div>
  );
}
