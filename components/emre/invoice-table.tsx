"use client";

import { Download } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice } from "@/data/types";

const statusVariant = {
  paid: "success" as const,
  pending: "warning" as const,
  overdue: "danger" as const,
  financed: "info" as const,
};

export function InvoiceTable({
  invoices,
  onSelect,
}: {
  invoices: Invoice[];
  onSelect: (inv: Invoice) => void;
}) {
  return (
    <div className="surface-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead>Invoice</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Financing</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow
              key={inv.id}
              className="border-slate-200 cursor-pointer hover:bg-white/5"
              onClick={() => onSelect(inv)}
            >
              <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
              <TableCell>{inv.orderId.toUpperCase()}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(inv.amount)}</TableCell>
              <TableCell>{formatDate(inv.dueDate)}</TableCell>
              <TableCell>
                <StatusBadge variant={statusVariant[inv.status]}>{inv.status}</StatusBadge>
              </TableCell>
              <TableCell>
                <StatusBadge variant={inv.financingStatus === "approved" ? "success" : "default"}>
                  {inv.financingStatus}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                  <Download className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
