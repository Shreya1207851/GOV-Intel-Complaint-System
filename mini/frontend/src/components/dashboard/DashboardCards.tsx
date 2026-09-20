import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DashboardCardItem {
  label: string;
  value: string | number;
  helper: string;
  delta: string;
  icon: React.ElementType;
}

export const DashboardCards: React.FC<{ items: DashboardCardItem[]; loading?: boolean }> = ({ items, loading }) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const positive = !item.delta.trim().startsWith("-");
        const Icon = item.icon;

        return (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="holographic-card group rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  positive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
                )}
              >
                {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {item.delta}
              </span>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold tracking-[-0.04em] text-foreground">{loading ? "..." : item.value}</p>
              <p className="text-sm text-muted-foreground">{item.helper}</p>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
};

export default DashboardCards;
