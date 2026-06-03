"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/emre/status-badge";
import { Button } from "@/components/ui/button";
import type { NetworkEntity } from "@/data/types";
import {
  MapPin,
  Mail,
  Phone,
  Package,
  FileText,
  Wrench,
  CreditCard,
} from "lucide-react";
import { getMarkerColor } from "@/lib/google-maps-adapter";

const roleLabels: Record<string, string> = {
  supplier: "Supplier",
  dealer: "Dealer / Seller",
  customer: "Customer",
  service: "Service partner",
  finance: "Finance partner",
  showroom: "Showroom",
};

export function NetworkEntityDrawer({
  entity,
  open,
  onClose,
}: {
  entity: NetworkEntity | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  if (!entity) return null;

  const profileHref =
    entity.role === "supplier"
      ? `/marketplace?supplierId=${entity.id}`
      : entity.role === "service"
        ? "/service-network"
        : `/network-map`;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="surface-card-elevated w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left pr-8">{entity.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">{roleLabels[entity.role]}</StatusBadge>
            <StatusBadge>{entity.subtype.replace(/_/g, " ")}</StatusBadge>
            {!entity.active && <StatusBadge variant="warning">Inactive</StatusBadge>}
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-slate-400" />
              {entity.city}, {entity.region}, {entity.country}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-slate-400" />
              {entity.contactEmail}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-slate-400" />
              {entity.contactPhone}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Active RFQs" value={entity.activeRfqs} icon={FileText} />
            <Stat label="Active orders" value={entity.activeOrders} icon={Package} />
            <Stat label="Service tickets" value={entity.serviceTickets} icon={Wrench} />
            <Stat
              label="Finance"
              value={entity.financeAvailable ? "Available" : "N/A"}
              icon={CreditCard}
            />
          </div>

          <Section title="Coverage area">{entity.coverageArea}</Section>
          <Section title="Service level">{entity.serviceLevel}</Section>
          <Section title="Response time">{entity.responseTime}</Section>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Categories</p>
            <div className="flex flex-wrap gap-1">
              {entity.categories.map((c) => (
                <StatusBadge key={c}>{c}</StatusBadge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Certifications</p>
            <div className="flex flex-wrap gap-1">
              {entity.certifications.map((c) => (
                <StatusBadge key={c} variant="success">
                  {c}
                </StatusBadge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Products listed</p>
            <p className="text-sm text-slate-900">{entity.products} SKUs</p>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              router.push(profileHref);
              onClose();
            }}
          >
            Open network detail
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/rfq" onClick={onClose}>
              Create RFQ
            </Link>
          </Button>

          <div
            className="h-1 rounded-full"
            style={{ background: getMarkerColor(entity.role) }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-sm text-slate-900">{children}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
