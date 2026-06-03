"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayCircle, Check } from "lucide-react";
import { PageHeader } from "@/components/emre/app-shell";
import { useApp } from "@/context/app-context";
import { useDemo } from "@/context/demo-context";
import { DEMO_FLOWS } from "@/lib/demo-flows";
import { getHomeForRole } from "@/data/roles";
import { useUi } from "@/lib/ui-i18n";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function DemoPage() {
  const router = useRouter();
  const { t } = useUi();
  const { applyDemoSetup, enterWorkspace, workspaceCountry, workspaceReady, showToast } = useApp();
  const { getDemoStep, setDemoStep } = useDemo();

  const startFlow = (flowId: string) => {
    const flow = DEMO_FLOWS.find((f) => f.id === flowId);
    if (!flow) return;
    enterWorkspace({
      role: flow.role,
      industry: flow.industry ?? "Hospital / Clinic",
      country: workspaceCountry,
      companyType: flow.role === "admin" ? "Platform operator" : "Enterprise buyer",
    });
    applyDemoSetup({
      role: flow.role,
      industry: flow.industry,
      vertical: flow.vertical,
      country: workspaceCountry,
    });
    setDemoStep(flowId, 1);
    showToast(t("demo.flowStarted"));
    const firstHref = flow.steps[0]?.href;
    const target =
      firstHref === "/enter" || !firstHref ? getHomeForRole(flow.role) : firstHref;
    router.push(target);
  };

  const ensureFlowWorkspace = (flow: (typeof DEMO_FLOWS)[number]) => {
    if (workspaceReady) return;
    enterWorkspace({
      role: flow.role,
      industry: flow.industry ?? "Hospital / Clinic",
      country: workspaceCountry,
      companyType: flow.role === "admin" ? "Platform operator" : "Enterprise buyer",
    });
    applyDemoSetup({
      role: flow.role,
      industry: flow.industry,
      vertical: flow.vertical,
      country: workspaceCountry,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader titleKey="demo.title" descriptionKey="demo.subtitle" />

      <div className="grid gap-6">
        {DEMO_FLOWS.map((flow) => {
          const step = getDemoStep(flow.id);
          const progress = flow.steps.length
            ? Math.round((step / flow.steps.length) * 100)
            : 0;

          return (
            <div key={flow.id} className="surface-card rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{t(flow.titleKey)}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t(flow.subtitleKey)}</p>
                </div>
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700 shrink-0"
                  onClick={() => startFlow(flow.id)}
                >
                  <PlayCircle className="size-4" />
                  {t("demo.startFlow")}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t("demo.progress")}</span>
                  <span>
                    {step}/{flow.steps.length}
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              <ol className="grid sm:grid-cols-2 gap-2">
                {flow.steps.map((s, i) => {
                  const done = i < step;
                  const current = i === step - 1;
                  return (
                    <li key={s.labelKey}>
                      <Link
                        href={s.href === "/enter" ? getHomeForRole(flow.role) : s.href}
                        onClick={() => {
                          if (s.href !== "/enter") ensureFlowWorkspace(flow);
                          setDemoStep(flow.id, Math.max(step, i + 1));
                        }}
                        className={cn(
                          "block rounded-lg border px-3 py-2.5 text-xs transition-colors",
                          done && "border-emerald-200 bg-emerald-50/60",
                          current && "border-blue-300 bg-blue-50",
                          !done && !current && "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {done ? (
                            <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                          ) : (
                            <span className="size-5 shrink-0 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-medium">
                              {i + 1}
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-slate-800">{t(s.labelKey)}</p>
                            {s.descKey && (
                              <p className="text-slate-500 mt-0.5 line-clamp-2">{t(s.descKey)}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
