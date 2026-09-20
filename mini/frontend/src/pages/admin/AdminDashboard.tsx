import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText,
  Filter,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import DashboardCards, { DashboardCardItem } from "@/components/dashboard/DashboardCards";
import Charts from "@/components/dashboard/Charts";
import ComplaintTable from "@/components/dashboard/ComplaintTable";
import { DEPARTMENTS } from "@/config/departments";
import { complaintsApi, ComplaintRecord } from "@/services/complaintsApi";

const DATE_RANGES = ["All Time", "Last 7 Days", "Last 30 Days", "Last 6 Months"] as const;

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Assigned: "#2563eb",
  "In Progress": "#38bdf8",
  Resolved: "#22c55e",
  "No data": "#94a3b8",
};

const getWindowDays = (range: (typeof DATE_RANGES)[number]) => {
  switch (range) {
    case "Last 7 Days":
      return 7;
    case "Last 30 Days":
      return 30;
    case "Last 6 Months":
      return 180;
    default:
      return null;
  }
};

const formatPercentDelta = (current: number, previous: number) => {
  if (current === 0 && previous === 0) return "0%";
  if (previous === 0) return "+100%";
  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.abs(delta).toFixed(1).replace(".0", "");
  return `${delta >= 0 ? "+" : "-"}${rounded}%`;
};

const formatLongDate = (value: string) => new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<(typeof DATE_RANGES)[number]>("All Time");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await complaintsApi.listAll();
        setComplaints(data);
      } catch (_error) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints().catch(() => setLoading(false));
  }, []);

  const filteredByDept = useMemo(() => (
    selectedDept === "All Departments"
      ? complaints
      : complaints.filter((complaint) => complaint.category === selectedDept)
  ), [complaints, selectedDept]);

  const filteredComplaints = useMemo(() => {
    const days = getWindowDays(dateRange);
    if (!days) return filteredByDept;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return filteredByDept.filter((complaint) => new Date(complaint.createdAt).getTime() >= cutoff);
  }, [dateRange, filteredByDept]);

  const previousWindowComplaints = useMemo(() => {
    const days = getWindowDays(dateRange);
    if (!days) return [] as ComplaintRecord[];
    const now = Date.now();
    const currentCutoff = now - days * 24 * 60 * 60 * 1000;
    const previousCutoff = now - days * 2 * 24 * 60 * 60 * 1000;

    return filteredByDept.filter((complaint) => {
      const createdAt = new Date(complaint.createdAt).getTime();
      return createdAt >= previousCutoff && createdAt < currentCutoff;
    });
  }, [dateRange, filteredByDept]);

  const total = filteredComplaints.length;
  const pending = filteredComplaints.filter((complaint) => complaint.status === "Pending").length;
  const assigned = filteredComplaints.filter((complaint) => complaint.status === "Assigned").length;
  const inProgress = filteredComplaints.filter((complaint) => complaint.status === "In Progress").length;
  const resolved = filteredComplaints.filter((complaint) => complaint.status === "Resolved").length;

  const openComplaintAges = filteredComplaints
    .filter((complaint) => complaint.status !== "Resolved")
    .map((complaint) => (Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const avgOpenAge = openComplaintAges.length
    ? Math.round(openComplaintAges.reduce((sum, value) => sum + value, 0) / openComplaintAges.length)
    : 0;

  const slaRiskCount = filteredComplaints.filter((complaint) => {
    const age = (Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return complaint.status !== "Resolved" && age >= 7;
  }).length;

  const statCards: DashboardCardItem[] = [
    {
      label: "Total Complaints",
      value: total,
      helper: loading ? "Loading complaint records" : "System-wide complaints in the active filter",
      delta: formatPercentDelta(total, previousWindowComplaints.length),
      icon: FileText,
    },
    {
      label: "Pending",
      value: pending,
      helper: loading ? "Loading pending workload" : "Complaints waiting for action",
      delta: `${pending > 0 ? "+" : ""}${pending}`,
      icon: AlertTriangle,
    },
    {
      label: "In Progress",
      value: assigned + inProgress,
      helper: loading ? "Loading active cases" : "Assigned or currently being worked",
      delta: `${assigned} assigned`,
      icon: Gauge,
    },
    {
      label: "Resolved",
      value: resolved,
      helper: loading ? "Loading closure count" : `${total ? Math.round((resolved / total) * 100) : 0}% of filtered complaints closed`,
      delta: `${slaRiskCount > 0 ? "-" : "+"}${slaRiskCount || resolved}`,
      icon: CheckCircle2,
    },
  ];

  const chartData = useMemo(() => {
    const bucketCount = dateRange === "All Time" ? 12 : dateRange === "Last 6 Months" ? 6 : 8;
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const months = Array.from({ length: bucketCount }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (bucketCount - index - 1));
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: formatter.format(date),
        submitted: 0,
        resolved: 0,
      };
    });

    const lookup = new Map(months.map((month) => [month.key, month]));

    filteredComplaints.forEach((complaint) => {
      const createdAt = new Date(complaint.createdAt);
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const bucket = lookup.get(key);
      if (bucket) bucket.submitted += 1;

      if (complaint.status === "Resolved") {
        const resolvedAt = new Date(complaint.updatedAt || complaint.createdAt);
        const resolvedKey = `${resolvedAt.getFullYear()}-${resolvedAt.getMonth()}`;
        const resolvedBucket = lookup.get(resolvedKey);
        if (resolvedBucket) resolvedBucket.resolved += 1;
      }
    });

    return months;
  }, [dateRange, filteredComplaints]);

  const statusData = [
    { name: "Pending", value: pending },
    { name: "Assigned", value: assigned },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ].filter((item) => item.value > 0);

  const topDepartments = useMemo(() => (
    DEPARTMENTS.map((department) => {
      const departmentComplaints = filteredComplaints.filter((complaint) => complaint.category === department);
      const departmentResolved = departmentComplaints.filter((complaint) => complaint.status === "Resolved").length;

      return {
        name: department,
        total: departmentComplaints.length,
        resolvedRate: departmentComplaints.length
          ? Math.round((departmentResolved / departmentComplaints.length) * 100)
          : 0,
      };
    })
      .filter((department) => department.total > 0)
      .sort((left, right) => right.total - left.total)
      .slice(0, 4)
  ), [filteredComplaints]);

  const urgentComplaints = useMemo(() => (
    filteredComplaints
      .filter((complaint) => complaint.status !== "Resolved")
      .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
      .slice(0, 4)
      .map((complaint) => ({
        ...complaint,
        age: Math.max(1, Math.round((Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24))),
      }))
  ), [filteredComplaints]);

  const tableComplaints = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return filteredComplaints
      .filter((complaint) => statusFilter === "All" || complaint.status === statusFilter)
      .filter((complaint) => {
        if (!normalizedSearch) return true;
        return [
          complaint.reference,
          complaint.title,
          complaint.category,
          complaint.status,
          complaint.location,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch));
      })
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 8);
  }, [filteredComplaints, search, statusFilter]);

  const geoCoverage = useMemo(() => {
    const withLocation = filteredComplaints.filter((complaint) => complaint.location?.trim()).length;
    return total ? Math.round((withLocation / total) * 100) : 0;
  }, [filteredComplaints, total]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-6 lg:px-8">
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Modern admin command center
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                Complaint Resolution Dashboard
              </h1>
              <p className="mt-3 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
                Live complaint intake, workflow health, and governance signals presented in a cleaner blue-first control room without changing any of the underlying system logic.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Range</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{dateRange}</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Department</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{selectedDept === "All Departments" ? "All teams" : selectedDept}</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Coverage</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{geoCoverage}% tagged</p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-4 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <select
                  value={dateRange}
                  onChange={(event) => setDateRange(event.target.value as (typeof DATE_RANGES)[number])}
                  className="h-11 bg-transparent text-sm text-foreground outline-none"
                >
                  {DATE_RANGES.map((range) => (
                    <option key={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-4 shadow-sm">
                <Filter className="h-4 w-4 text-primary" />
                <select
                  value={selectedDept}
                  onChange={(event) => setSelectedDept(event.target.value)}
                  className="h-11 bg-transparent text-sm text-foreground outline-none"
                >
                  <option>All Departments</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                Pending: {pending}
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                In Progress: {assigned + inProgress}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Resolved: {resolved}
              </span>
            </div>
          </div>
        </div>
      </section>

      <DashboardCards items={statCards} loading={loading} />

      <Charts trendData={chartData} statusData={statusData} statusColors={STATUS_COLORS} />

      <ComplaintTable
        complaints={tableComplaints}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="holographic-card rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Top Departments</h2>
              <p className="mt-1 text-sm text-muted-foreground">Highest complaint load in the current filter.</p>
            </div>
            <Building2 className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-3">
            {topDepartments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No department data available for this filter.
              </div>
            ) : (
              topDepartments.map((department, index) => (
                <div key={department.name} className="holographic-card rounded-2xl border border-border/60 bg-background/80 p-4 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{department.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{department.total} complaints</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950/60">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${department.resolvedRate}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{department.resolvedRate}% resolution rate</p>
                </div>
              ))
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="holographic-card rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Priority Queue</h2>
              <p className="mt-1 text-sm text-muted-foreground">Oldest unresolved complaints needing attention.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>

          <div className="mt-5 space-y-3">
            {urgentComplaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No urgent complaints in this range.
              </div>
            ) : (
              urgentComplaints.map((complaint) => (
                <div key={complaint.id} className="holographic-card rounded-2xl border border-border/60 bg-background/80 p-4 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{complaint.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{complaint.reference} • {complaint.category}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      {complaint.age}d open
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Opened {formatLongDate(complaint.createdAt)}{complaint.location ? ` • ${complaint.location}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="holographic-card rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Governance Signals</h2>
              <p className="mt-1 text-sm text-muted-foreground">Operational quality checks from current complaint data.</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Location tagging</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">{geoCoverage}%</p>
              <p className="mt-2 text-sm text-muted-foreground">Complaints with location context usable for ward or area-level action.</p>
            </div>

            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Average open age</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">{avgOpenAge} days</p>
              <p className="mt-2 text-sm text-muted-foreground">Average age of unresolved complaints in the active dashboard view.</p>
            </div>

            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recommended focus</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {slaRiskCount > 0
                  ? "Escalate aging complaints and tighten follow-up with departments carrying the oldest open cases."
                  : "Current flow is stable. Maintain assignment speed and keep monitoring complaint intake trends."}
              </p>
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default AdminDashboard;
