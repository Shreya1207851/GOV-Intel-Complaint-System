import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { PlusCircle, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { complaintsApi } from "@/services/complaintsApi";

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const apiData = await complaintsApi.listMine();
        setComplaints(apiData);
      } catch (_err) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    load().catch(() => setLoading(false));
  }, []);

  const active = complaints.filter((c) => !["resolved", "Resolved", "closed"].includes(c.status as string));
  const resolved = complaints.filter((c) => (c.status as string)?.toLowerCase() === "resolved");

  const stats = [
    { label: "Total Complaints", value: complaints.length, icon: FileText, color: "text-primary" },
    { label: "Active", value: active.length, icon: Clock, color: "text-warning" },
    { label: "Escalated", value: complaints.filter((c) => c.status === "escalated").length, icon: AlertTriangle, color: "text-destructive" },
    { label: "Resolved", value: resolved.length, icon: CheckCircle, color: "text-success" },
  ];

  const resolutionRate = complaints.length > 0 ? Math.round((resolved.length / complaints.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-6 lg:px-8">
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <TrendingUp className="h-3.5 w-3.5" />
                Personal Portal
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                Welcome, {user?.name?.split(" ")[0] || "Citizen"}
              </h1>
              <p className="mt-3 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
                Track and manage all your complaints in one unified dashboard. Monitor resolution progress and communicate directly with authorities.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total Filed</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{complaints.length}</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resolution Rate</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{resolutionRate}%</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Active Cases</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{active.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.01 }}>
            <div className="holographic-card group rounded-3xl border border-border/60 bg-card p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-300">
                  <s.icon className={`w-5 h-5`} />
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link to="/citizen/complaints" className="flex-1">
          <Button variant="outline" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            View All Complaints
          </Button>
        </Link>
        <Link to="/citizen/new" className="flex-1">
          <Button className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            File New Complaint
          </Button>
        </Link>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading font-semibold text-foreground">Recent Complaints</h2>
            {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
            <Link to="/citizen/complaints" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No complaints filed yet.</p>
              </div>
            ) : (
              complaints.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={`/citizen/complaints/${c.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.reference} · {c.category}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {c.aiUrgencyScore && (
                      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                        <Brain className="w-3.5 h-3.5" />
                        {c.aiUrgencyScore}
                      </div>
                    )}
                    <StatusBadge status={c.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="holographic-card rounded-3xl border border-border/60 bg-card bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Status Overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">Current status of your submitted complaints.</p>
            </div>
            <FileText className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-3">
            {complaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No complaint data available yet.
              </div>
            ) : (
              [
                { name: "Active", count: active.length, color: "from-amber-600 to-amber-400" },
                { name: "Resolved", count: resolved.length, color: "from-emerald-600 to-emerald-400" },
              ].map((status, index) => (
                status.count > 0 && (
                  <div key={status.name} className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{status.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{status.count} complaint{status.count !== 1 ? "s" : ""}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {complaints.length > 0 ? Math.round((status.count / complaints.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950/60">
                      <div className={`h-full rounded-full bg-gradient-to-r ${status.color}`} style={{ width: `${complaints.length > 0 ? Math.round((status.count / complaints.length) * 100) : 0}%` }} />
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="holographic-card rounded-3xl border border-border/60 bg-card bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Next Steps</h2>
              <p className="mt-1 text-sm text-muted-foreground">Recommended actions for complaint management.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Quick Action</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {active.length > 0 ? (
                  <>Check the status of your {active.length} active complaint{active.length !== 1 ? "s" : ""} above.</>
                ) : (
                  <>All your complaints have been resolved. Thank you for using our service!</>
                )}
              </p>
              {active.length > 0 && (
                <Link to="/citizen/complaints" className="mt-3 inline-block">
                  <Button size="sm" variant="outline">
                    View Active <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Stay Updated</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Enable notifications to get real-time updates on complaint status changes and authority responses.
              </p>
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default CitizenDashboard;
