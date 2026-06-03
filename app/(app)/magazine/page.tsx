"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { useRfq } from "@/context/rfq-context";

export default function MagazinePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <MagazineContent />
    </Suspense>
  );
}

function MagazineContent() {
  const searchParams = useSearchParams();
  const { vertical, language, followTopic, followedTopics } = useApp();
  const { openCreateRfq } = useRfq();
  const [selected, setSelected] = useState<MagazineItem | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const items = magazineItems.filter((m) => m.vertical === vertical);

  const articleFromUrl = useMemo(() => {
    const articleId = searchParams.get("articleId");
    return articleId ? magazineItems.find((m) => m.id === articleId) ?? null : null;
  }, [searchParams]);
  const activeArticle = selected ?? articleFromUrl;
  const videoFromUrl = activeArticle?.type === "video" && !!searchParams.get("articleId");

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

      <Dialog
        open={!!activeArticle && !(videoOpen || videoFromUrl)}
        onOpenChange={() => setSelected(null)}
      >
        <DialogContent className="surface-card-elevated border-slate-200 max-w-lg">
          {activeArticle && (
            <>
              <DialogHeader>
                <DialogTitle>{t(activeArticle.title, language)}</DialogTitle>
              </DialogHeader>
              <div className={`h-40 rounded-lg bg-gradient-to-br ${activeArticle.imageGradient} mb-4`} />
              <p className="text-sm text-foreground/80">{t(activeArticle.excerpt, language)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {activeArticle.author} · {activeArticle.publishedAt} · {activeArticle.readTime}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => followTopic(activeArticle.type)}
                >
                  {followedTopics.includes(activeArticle.type) ? "Following" : "Follow Topic"}
                </Button>
                <Link href="/marketplace">
                  <Button variant="outline" className="gap-2">
                    Browse Marketplace <ArrowRight className="size-3" />
                  </Button>
                </Link>
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    openCreateRfq({
                      source: "generic",
                      vertical,
                      useCase: activeArticle ? t(activeArticle.title, language) : undefined,
                    })
                  }
                >
                  Start RFQ <ArrowRight className="size-3" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={videoOpen || videoFromUrl} onOpenChange={setVideoOpen}>
        <DialogContent className="surface-card-elevated border-slate-200">
          <DialogHeader>
            <DialogTitle>{activeArticle && t(activeArticle.title, language)}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-violet-600/30 to-cyan-600/30 flex items-center justify-center">
            <Play className="size-16 text-white/50" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
