"use client";

import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { MagazineCard } from "@/components/emre/magazine-card";
import { useApp } from "@/context/app-context";
import { magazineItems } from "@/data/magazine";
import { t } from "@/lib/i18n";
import type { MagazineItem } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function MagazinePage() {
  const { vertical, language } = useApp();
  const [selected, setSelected] = useState<MagazineItem | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const items = magazineItems.filter((m) => m.vertical === vertical);

  const handleSelect = (item: MagazineItem) => {
    setSelected(item);
    if (item.type === "video") setVideoOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Magazine"
        description="Content-commerce hub — buyer guides, case studies, product comparisons, and industry insights."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <MagazineCard key={item.id} item={item} onClick={() => handleSelect(item)} />
        ))}
      </div>

      <Dialog open={!!selected && !videoOpen} onOpenChange={() => setSelected(null)}>
        <DialogContent className="glass-panel-strong border-white/10 max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{t(selected.title, language)}</DialogTitle>
              </DialogHeader>
              <div className={`h-40 rounded-lg bg-gradient-to-br ${selected.imageGradient} mb-4`} />
              <p className="text-sm text-foreground/80">{t(selected.excerpt, language)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {selected.author} · {selected.publishedAt} · {selected.readTime}
              </p>
              <div className="flex gap-2 mt-4">
                <Link href="/marketplace">
                  <Button variant="outline" className="gap-2">
                    Browse Marketplace <ArrowRight className="size-3" />
                  </Button>
                </Link>
                <Link href="/rfq">
                  <Button className="gap-2 bg-cyan-600 hover:bg-cyan-500">
                    Start RFQ <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="glass-panel-strong border-white/10">
          <DialogHeader>
            <DialogTitle>{selected && t(selected.title, language)}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-violet-600/30 to-cyan-600/30 flex items-center justify-center">
            <Play className="size-16 text-white/50" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
