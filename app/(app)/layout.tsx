import { AppShell } from "@/components/emre/app-shell";
import { GlobalSearchCommand } from "@/components/emre/global-search/global-search-command";
import { WorkspaceGate } from "@/components/emre/workspace-gate";
import { GlobalSearchProvider } from "@/context/global-search-context";
import { CartDrawer } from "@/components/emre/commerce/cart-drawer";
import { CreateRfqWizard } from "@/components/emre/rfq/create-rfq-wizard";
import { AppToast } from "@/components/emre/app-toast";
import { DemoDialogHost } from "@/components/emre/demo-toast-host";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceGate>
      <GlobalSearchProvider>
        <AppShell>{children}</AppShell>
        <GlobalSearchCommand />
        <CartDrawer />
        <CreateRfqWizard />
        <AppToast />
        <DemoDialogHost />
      </GlobalSearchProvider>
    </WorkspaceGate>
  );
}
