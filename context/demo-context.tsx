"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEMO_PROGRESS_KEY = "de-demo-flow-progress";

interface DemoContextValue {
  apiKeyDialogOpen: boolean;
  generatedApiKey: string | null;
  generateApiKey: () => void;
  closeApiKeyDialog: () => void;
  demoProgress: Record<string, number>;
  setDemoStep: (flowId: string, step: number) => void;
  getDemoStep: (flowId: string) => number;
  groupBuyDialogOpen: boolean;
  openGroupBuyDialog: () => void;
  closeGroupBuyDialog: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function loadProgress(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DEMO_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState<Record<string, number>>(() =>
    typeof window !== "undefined" ? loadProgress() : {}
  );
  const [groupBuyDialogOpen, setGroupBuyDialogOpen] = useState(false);

  const generateApiKey = useCallback(() => {
    const key = `de_live_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    setGeneratedApiKey(key);
    setApiKeyDialogOpen(true);
  }, []);

  const closeApiKeyDialog = useCallback(() => {
    setApiKeyDialogOpen(false);
  }, []);

  const setDemoStep = useCallback((flowId: string, step: number) => {
    setDemoProgress((prev) => {
      const next = { ...prev, [flowId]: step };
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_PROGRESS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getDemoStep = useCallback(
    (flowId: string) => demoProgress[flowId] ?? 0,
    [demoProgress]
  );

  const value = useMemo(
    () => ({
      apiKeyDialogOpen,
      generatedApiKey,
      generateApiKey,
      closeApiKeyDialog,
      demoProgress,
      setDemoStep,
      getDemoStep,
      groupBuyDialogOpen,
      openGroupBuyDialog: () => setGroupBuyDialogOpen(true),
      closeGroupBuyDialog: () => setGroupBuyDialogOpen(false),
    }),
    [
      apiKeyDialogOpen,
      generatedApiKey,
      generateApiKey,
      closeApiKeyDialog,
      demoProgress,
      setDemoStep,
      getDemoStep,
      groupBuyDialogOpen,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
