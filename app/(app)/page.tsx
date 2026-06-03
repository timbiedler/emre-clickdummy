"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { getHomeForRole } from "@/data/roles";
import AdminHomePage from "@/components/portals/admin-home";
import CustomerHomePage from "@/components/portals/customer-home";

export default function HomePage() {
  const { role } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin" && role !== "customer") {
      router.replace(getHomeForRole(role));
    }
  }, [role, router]);

  if (role === "admin") return <AdminHomePage />;
  if (role === "customer") return <CustomerHomePage />;

  return (
    <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
      Redirecting to your portal…
    </div>
  );
}
