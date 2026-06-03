"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductDetailView } from "./commerce/product-detail-view";

export function ProductDetailDrawer({
  product,
  open,
  onClose,
  onViewSupplier,
}: {
  product: import("@/data/types").Product | null;
  open: boolean;
  onClose: () => void;
  onViewSupplier?: (id: string) => void;
}) {
  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="surface-card-elevated border-slate-200 w-full sm:max-w-3xl overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="sr-only">Product detail</SheetTitle>
            </SheetHeader>
            <ProductDetailView product={product} onViewSupplier={onViewSupplier} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
