import { StatusBadge } from "./status-badge";
import type { AdminAlert } from "@/data/types";

export function ActivityFeed({
  items,
}: {
  items: { action: string; detail: string; time: string }[];
}) {
  return (
    <div className="surface-card rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium">Recent Activity</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <div className="mt-1 size-2 rounded-full bg-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.action}</p>
              <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlertCenter({ alerts }: { alerts: AdminAlert[] }) {
  const severityVariant = {
    info: "info" as const,
    warning: "warning" as const,
    critical: "danger" as const,
  };

  return (
    <div className="surface-card rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium">Alert Center</p>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {alerts.slice(0, 8).map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1 hover:border-blue-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <StatusBadge variant={severityVariant[alert.severity]}>
                {alert.type}
              </StatusBadge>
              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
            </div>
            <p className="text-sm">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
