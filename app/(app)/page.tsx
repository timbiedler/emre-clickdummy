"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { getHomeForRole } from "@/data/roles";

export default function HomePage() {
  const { role, workspaceReady } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (workspaceReady) {
      router.replace(getHomeForRole(role));
    }
  }, [role, workspaceReady, router]);

  return (
    <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
      Redirecting to your portal…
    </div>
  );
}
