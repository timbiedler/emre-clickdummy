import { AppShell } from "@/components/emre/app-shell";
import { WorkspaceGate } from "@/components/emre/workspace-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceGate>
      <AppShell>{children}</AppShell>
    </WorkspaceGate>
  );
}
