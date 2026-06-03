"use client";

import { motion } from "framer-motion";
import { MetricCard } from "./metric-card";
import type { AdminMetrics } from "@/data/types";

export function AdminKpiCard({
  metrics,
  onKpiClick,
}: {
  metrics: AdminMetrics;
  onKpiClick?: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.kpis.map((kpi, i) => (
        <MetricCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          accent={(["cyan", "violet", "green", "blue"] as const)[i % 4]}
          onClick={() => onKpiClick?.(kpi.label)}
        />
      ))}
    </div>
  );
}

export function AdminMetricGrid({ metrics }: { metrics: AdminMetrics }) {
  const items = [
    { label: "Revenue Pipeline", value: `€${(metrics.revenue / 1000000).toFixed(2)}M`, change: metrics.revenueChange },
    { label: "RFQ Volume", value: metrics.rfqVolume, change: 8.2 },
    { label: "Active Suppliers", value: metrics.activeSuppliers },
    { label: "Active Buyers", value: metrics.activeBuyers },
    { label: "Products Listed", value: metrics.marketplaceProducts },
    { label: "Finance Apps", value: metrics.financeApplications },
    { label: "Orders in Transit", value: metrics.ordersInTransit },
    { label: "Translation Queue", value: metrics.translationQueue },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <MetricCard
            label={item.label}
            value={item.value}
            change={item.change}
            accent={(["cyan", "violet", "green", "blue"] as const)[i % 4]}
          />
        </motion.div>
      ))}
    </div>
  );
}
