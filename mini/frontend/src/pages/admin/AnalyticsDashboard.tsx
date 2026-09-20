import React, { useState } from "react";
import { MOCK_COMPLAINTS } from "@/data/mockData";
import { DEPARTMENTS } from "@/config/departments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── Mock time-series data ── */
const TIME_SERIES = [
  { month: "Jul", submitted: 18, resolved: 12, escalated: 3 },
  { month: "Aug", submitted: 24, resolved: 18, escalated: 4 },
  { month: "Sep", submitted: 30, resolved: 22, escalated: 5 },
  { month: "Oct", submitted: 27, resolved: 20, escalated: 3 },
  { month: "Nov", submitted: 35, resolved: 28, escalated: 6 },
  { month: "Dec", submitted: 42, resolved: 30, escalated: 8 },
];

const DEPT_DATA = DEPARTMENTS.slice(0, 7).map((dept) => {
  const total = MOCK_COMPLAINTS.filter((c) => c.assignedDept === dept).length;
  return { name: dept.split(" ")[0], total: total || Math.floor(Math.random() * 10) + 2 };
});

const STATUS_DATA = [
  { name: "Submitted", value: MOCK_COMPLAINTS.filter((c) => c.status === "submitted").length, color: "hsl(205, 80%, 52%)" },
  { name: "In Progress", value: MOCK_COMPLAINTS.filter((c) => c.status === "in_progress").length, color: "hsl(38, 92%, 50%)" },
  { name: "Escalated", value: MOCK_COMPLAINTS.filter((c) => c.status === "escalated").length, color: "hsl(0, 72%, 51%)" },
  { name: "Resolved", value: MOCK_COMPLAINTS.filter((c) => c.status === "resolved").length, color: "hsl(152, 60%, 40%)" },
  { name: "Closed", value: MOCK_COMPLAINTS.filter((c) => c.status === "closed").length, color: "hsl(215, 12%, 50%)" },
];

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 6 Months", "This Year"];

const KPI_CARD = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [dept, setDept] = useState("All Departments");

  const total = MOCK_COMPLAINTS.length;
  const resolved = MOCK_COMPLAINTS.filter((c) => c.status === "resolved").length;
  const pending = MOCK_COMPLAINTS.filter((c) => ["submitted", "in_progress"].includes(c.status)).length;
  const avgResolution = 4.8; // mock days

  const kpis = [
    { label: "Total Complaints", value: total, icon: FileText, color: "text-info", bg: "bg-info/10" },
    { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Avg Resolution (days)", value: avgResolution, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Complaint trends, resolutions & department performance</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              <option>All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={KPI_CARD} initial="hidden" animate="show" whileHover={{ y: -4, scale: 1.01 }}>
            <Card className="glass-card holographic-card transition-transform duration-200">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                  <k.icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Complaints Over Time (Line) */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ y: -4, scale: 1.01 }}>
        <Card className="glass-card holographic-card transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Complaints Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={TIME_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(215,25%,11%)",
                    border: "1px solid hsl(215,20%,18%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "hsl(210,20%,92%)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="submitted" stroke="hsl(205,80%,52%)" strokeWidth={2.5} dot={{ r: 4 }} name="Submitted" />
                <Line type="monotone" dataKey="resolved" stroke="hsl(152,60%,40%)" strokeWidth={2.5} dot={{ r: 4 }} name="Resolved" />
                <Line type="monotone" dataKey="escalated" stroke="hsl(0,72%,51%)" strokeWidth={2.5} dot={{ r: 4 }} name="Escalated" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bar + Pie row */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} whileHover={{ y: -4, scale: 1.01 }}>
          <Card className="glass-card holographic-card transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" /> Department-wise Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={DEPT_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(215,25%,11%)",
                      border: "1px solid hsl(215,20%,18%)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "hsl(210,20%,92%)",
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(217,71%,42%)" radius={[0, 4, 4, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} whileHover={{ y: -4, scale: 1.01 }}>
          <Card className="glass-card holographic-card transition-transform duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={STATUS_DATA} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={3}>
                    {STATUS_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(215,25%,11%)",
                      border: "1px solid hsl(215,20%,18%)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "hsl(210,20%,92%)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {STATUS_DATA.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resolution Rate Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={{ y: -4, scale: 1.01 }}>
        <Card className="glass-card holographic-card transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Department Resolution Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {DEPARTMENTS.slice(0, 7).map((d) => {
                const all = MOCK_COMPLAINTS.filter((c) => c.assignedDept === d);
                const res = all.filter((c) => c.status === "resolved").length;
                const rate = all.length ? Math.round((res / all.length) * 100) : Math.floor(Math.random() * 50) + 30;
                return (
                  <div key={d} className="flex items-center gap-4 py-3">
                    <p className="text-sm font-medium text-foreground w-36 shrink-0">{d}</p>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${rate}%`,
                          background: rate >= 70 ? "hsl(152,60%,40%)" : rate >= 40 ? "hsl(38,92%,50%)" : "hsl(0,72%,51%)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground w-12 text-right shrink-0">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
