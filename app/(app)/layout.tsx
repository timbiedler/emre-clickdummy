import { AppShell } from "@/components/emre/app-shell";
import { GlobalSearchCommand } from "@/components/emre/global-search/global-search-command";
import { WorkspaceGate } from "@/components/emre/workspace-gate";
import { GlobalSearchProvider } from "@/context/global-search-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceGate>
      <GlobalSearchProvider>
        <AppShell>{children}</AppShell>
        <GlobalSearchCommand />
      </GlobalSearchProvider>
    </WorkspaceGate>
  );
}
