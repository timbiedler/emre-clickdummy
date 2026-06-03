"use client";

import { useState } from "react";
import { Building2, Users, Heart, FileText, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { IndustryProfileCard } from "@/components/emre/industry-profile-card";
import { IndustrySelector } from "@/components/emre/industry-selector";
import { InvoiceTable } from "@/components/emre/invoice-table";
import { StatusBadge } from "@/components/emre/status-badge";
import { useApp } from "@/context/app-context";
import { invoices, rfqs, orders, financeApplications } from "@/data";
import { buyers } from "@/data/buyers";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function AccountPage() {
  const { vertical, industry, companyType, workspaceCountry } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const buyer = buyers.find((b) => b.vertical === vertical);
  const verticalInvoices = invoices.filter((i) => i.vertical === vertical);
  const verticalRfqs = rfqs.filter((r) => r.vertical === vertical).slice(0, 5);
  const verticalOrders = orders.filter((o) => o.vertical === vertical).slice(0, 5);
  const verticalFinance = financeApplications.filter((f) => f.vertical === vertical);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="account.title"
        descriptionKey="account.subtitle"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid md:grid-cols-4 gap-4">
          <Stat icon={Building2} label="Company" value={buyer?.name ?? "—"} />
          <Stat icon={Users} label="Active Users" value="12" />
          <Stat icon={FileText} label="Open RFQs" value={String(buyer?.activeRfqs ?? 0)} />
          <Stat icon={Heart} label="Saved Products" value="8" />
        </div>
        <IndustryProfileCard />
      </div>

      <div className="surface-card p-4 flex flex-wrap items-center gap-4">
        <IndustrySelector />
        <p className="text-xs text-slate-500">
          {industry} · {workspaceCountry} · {companyType}
        </p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="surface-card border-slate-200">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="finance">Financing</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <InvoiceTable invoices={verticalInvoices} onSelect={setSelectedInvoice} />
        </TabsContent>

        <TabsContent value="rfqs" className="mt-4 space-y-2">
          {verticalRfqs.map((r) => (
            <div key={r.id} className="surface-card rounded-lg p-3 flex items-center justify-between text-sm">
              <span className="font-mono">{r.id.toUpperCase()}</span>
              <StatusBadge variant="info">{r.status.replace("_", " ")}</StatusBadge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="orders" className="mt-4 space-y-2">
          {verticalOrders.map((o) => (
            <div key={o.id} className="surface-card rounded-lg p-3 flex items-center justify-between text-sm">
              <span className="font-mono">{o.id.toUpperCase()}</span>
              <span>{formatCurrency(o.amount)}</span>
              <StatusBadge variant="info">{o.status}</StatusBadge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="finance" className="mt-4 grid md:grid-cols-2 gap-3">
          {verticalFinance.map((f) => (
            <div key={f.id} className="surface-card rounded-lg p-4 text-sm space-y-1">
              <p className="font-medium">{f.product}</p>
              <p className="text-muted-foreground">{formatCurrency(f.amount)} · {f.type}</p>
              <StatusBadge variant="warning">{f.status.replace("_", " ")}</StatusBadge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <div className="surface-card rounded-xl p-8 text-center text-muted-foreground">
            <MessageSquare className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">3 unread messages from suppliers</p>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="surface-card-elevated border-slate-200">
          {selectedInvoice && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedInvoice.invoiceNumber}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Row label="Order" value={selectedInvoice.orderId.toUpperCase()} />
                <Row label="Amount" value={formatCurrency(selectedInvoice.amount)} />
                <Row label="Due Date" value={formatDate(selectedInvoice.dueDate)} />
                <Row label="Status" value={selectedInvoice.status} />
                <Row label="Financing" value={selectedInvoice.financingStatus} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="surface-card rounded-xl p-4">
      <Icon className="size-4 text-blue-600 mb-2" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm truncate">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between surface-card rounded-lg p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
