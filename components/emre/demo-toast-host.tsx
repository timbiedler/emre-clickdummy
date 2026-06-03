"use client";

import { useApp } from "@/context/app-context";
import { useDemo } from "@/context/demo-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Demo dialogs (API key, group buy) — toasts use AppToast + useApp().showToast */
export function DemoDialogHost() {
  const { showToast } = useApp();
  const {
    apiKeyDialogOpen,
    generatedApiKey,
    closeApiKeyDialog,
    groupBuyDialogOpen,
    closeGroupBuyDialog,
  } = useDemo();

  return (
    <>
      <Dialog open={apiKeyDialogOpen} onOpenChange={(o) => !o && closeApiKeyDialog()}>
        <DialogContent className="surface-card-elevated sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API key (mock)</DialogTitle>
          </DialogHeader>
          {generatedApiKey && (
            <div className="space-y-3">
              <code className="block rounded-lg bg-slate-100 p-3 text-xs break-all font-mono">
                {generatedApiKey}
              </code>
              <p className="text-xs text-slate-500">
                Demo only — copy for integration walkthrough. Not a real credential.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  void navigator.clipboard?.writeText(generatedApiKey);
                  showToast("API key copied to clipboard");
                  closeApiKeyDialog();
                }}
              >
                Copy & close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={groupBuyDialogOpen} onOpenChange={(o) => !o && closeGroupBuyDialog()}>
        <DialogContent className="surface-card-elevated sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join group buy</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            You are joining the pooled procurement run. An RFQ draft will be prefilled with group-buy terms.
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={closeGroupBuyDialog}>
            Continue in RFQ wizard
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
