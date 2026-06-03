"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/format";
import {
  financeStatusLabel,
  financeStatusVariant,
} from "@/lib/product-finance";
import type { Offer } from "@/data/types";
import { suppliers } from "@/data/suppliers";

export function OfferComparisonTable({ offers }: { offers: Offer[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Offer Comparison</p>
        <StatusBadge variant="violet">
          <Sparkles className="size-3 mr-1" /> AI-assisted
        </StatusBadge>
      </div>
      <div className="surface-card rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead>Supplier</TableHead>
              <TableHead>Purchase</TableHead>
              <TableHead>Lease/mo</TableHead>
              <TableHead>Down</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Finance</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => {
              const supplier = suppliers.find((s) => s.id === offer.supplierId);
              return (
                <TableRow key={offer.id} className="border-slate-200">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {supplier?.name ?? offer.supplierId}
                        {offer.aiRecommended && (
                          <StatusBadge variant="success">
                            <Sparkles className="size-3 mr-1" /> AI Pick
                          </StatusBadge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {offer.deliveryDays}d · {offer.complianceScore}% compliance
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-accent-blue">
                    {formatCurrency(offer.price)}
                  </TableCell>
                  <TableCell className="font-semibold text-accent-green">
                    {formatCurrency(offer.leasingRateMonthly)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatCurrency(offer.downPayment)}
                  </TableCell>
                  <TableCell className="text-xs">{offer.termMonths}mo</TableCell>
                  <TableCell className="text-xs max-w-[100px] truncate">
                    {offer.serviceBundle}
                  </TableCell>
                  <TableCell>
                    <StatusBadge variant={financeStatusVariant[offer.financingStatus]}>
                      {financeStatusLabel[offer.financingStatus]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        {offers.slice(0, 3).map((o) => (
          <div key={o.id} className="surface-card rounded-lg p-2">
            <span className="text-muted-foreground">Monthly total: </span>
            <span className="font-semibold text-accent-green">
              {formatCurrency(o.monthlyCost)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
