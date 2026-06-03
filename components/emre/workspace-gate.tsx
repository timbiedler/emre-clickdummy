"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const { workspaceReady } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!workspaceReady) {
      const timer = window.setTimeout(() => {
        router.replace("/enter");
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [workspaceReady, router]);

  if (!workspaceReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading workspace…
      </div>
    );
  }

  return <>{children}</>;
}
