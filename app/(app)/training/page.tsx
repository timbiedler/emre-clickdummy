"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Play } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { trainingCourses } from "@/data/training";
import { useApp } from "@/context/app-context";
import { t as localizedText } from "@/lib/i18n";
import { useUi } from "@/lib/ui-i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TrainingCourse } from "@/data/training";

function TrainingContent() {
  const { vertical, language, includeAllProducts } = useApp();
  const { t } = useUi();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<TrainingCourse | null>(null);

  const courses = includeAllProducts
    ? trainingCourses
    : trainingCourses.filter((c) => c.vertical === vertical);

  const courseFromUrl = useMemo(() => {
    const id = searchParams.get("courseId");
    return id ? trainingCourses.find((c) => c.id === id) ?? null : null;
  }, [searchParams]);
  const activeCourse = selected ?? courseFromUrl;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("globalSearch.scope.training")}
        description="Role-based training modules for procurement, compliance, and robotics operations."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => setSelected(course)}
            className="surface-card rounded-xl p-5 text-left hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <GraduationCap className="size-5 text-blue-600 shrink-0" />
              <Badge variant="outline" className="text-[10px] capitalize">
                {course.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-slate-900 mt-3 line-clamp-2">
              {localizedText(course.title, language)}
            </h3>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
              {localizedText(course.description, language)}
            </p>
            <p className="text-[11px] text-slate-400 mt-3">
              {course.category} · {course.duration} · {course.level}
            </p>
          </button>
        ))}
      </div>

      <Sheet open={!!activeCourse} onOpenChange={() => setSelected(null)}>
        <SheetContent className="surface-card-elevated sm:max-w-md overflow-y-auto">
          {activeCourse && (
            <>
              <SheetHeader>
                <SheetTitle>{localizedText(activeCourse.title, language)}</SheetTitle>
              </SheetHeader>
              <p className="text-sm text-slate-600 mt-4">{localizedText(activeCourse.description, language)}</p>
              <Button className="mt-6 gap-2 bg-blue-600 hover:bg-blue-700 w-full" type="button">
                <Play className="size-4" />
                Start module
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function TrainingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading…</div>}>
      <TrainingContent />
    </Suspense>
  );
}
