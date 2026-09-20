import React from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface TrendPoint {
  label: string;
  submitted: number;
  resolved: number;
}

interface StatusPoint {
  name: string;
  value: number;
}

interface ChartsProps {
  trendData: TrendPoint[];
  statusData: StatusPoint[];
  statusColors: Record<string, string>;
}

export const Charts: React.FC<ChartsProps> = ({ trendData, statusData, statusColors }) => {
  const fallbackData = statusData.length ? statusData : [{ name: "No data", value: 1 }];

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <article className="rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <BarChart3 className="h-3.5 w-3.5" />
              Complaint Trends
            </div>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Complaint volume over time</h2>
            <p className="mt-1 text-sm text-muted-foreground">Submitted versus resolved complaints across the selected reporting window.</p>
          </div>
        </div>

        <div className="mt-6 h-[320px] md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(255,255,255,0.96)",
                  color: "#0f172a",
                }}
              />
              <Line type="monotone" dataKey="submitted" stroke="#2563eb" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} name="Submitted" />
              <Line type="monotone" dataKey="resolved" stroke="#38bdf8" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-3xl border border-border/60 bg-card bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <PieChartIcon className="h-3.5 w-3.5" />
          Status Distribution
        </div>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Current complaint status mix</h2>
        <p className="mt-1 text-sm text-muted-foreground">A quick view of pending, active, and resolved complaint share.</p>

        <div className="mt-6 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fallbackData}
                dataKey="value"
                innerRadius={60}
                outerRadius={94}
                paddingAngle={3}
                stroke="transparent"
              >
                {fallbackData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(255,255,255,0.96)",
                  color: "#0f172a",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[item.name] }} />
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default Charts;
