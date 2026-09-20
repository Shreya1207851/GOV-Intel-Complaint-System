import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DEPARTMENT_METADATA } from "@/config/departments";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ClipboardList, MapPin, Calendar, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { complaintsApi, ComplaintRecord, membersApi, MemberRecord } from "@/services/complaintsApi";

const DepartmentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedOfficer, setSelectedOfficer] = useState<Record<string, string>>({});
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const department = user?.department || "";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [complaintData, memberData] = await Promise.all([
          complaintsApi.listDepartment(),
          membersApi.list(),
        ]);
        setComplaints(complaintData);
        setMembers(memberData);
      } catch (_error) {
        setComplaints([]);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard().catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((complaint) => complaint.status === "Pending").length;
    const assigned = complaints.filter((complaint) => complaint.status === "Assigned").length;
    const inProgress = complaints.filter((complaint) => complaint.status === "In Progress").length;
    const resolved = complaints.filter((complaint) => complaint.status === "Resolved").length;

    return [
      { label: "Total", value: total, icon: ClipboardList, color: "text-foreground" },
      { label: "Pending", value: pending, icon: ClipboardList, color: "text-warning" },
      { label: "Assigned", value: assigned, icon: ClipboardList, color: "text-primary" },
      { label: "In Progress", value: inProgress, icon: ClipboardList, color: "text-info" },
      { label: "Resolved", value: resolved, icon: ClipboardList, color: "text-success" },
    ];
  }, [complaints]);

  const handleAssign = async (complaintId: string) => {
    const memberId = selectedOfficer[complaintId];
    if (!memberId) {
      toast({ title: "Select an officer", description: "Please choose an officer before assigning.", variant: "destructive" });
      return;
    }

    try {
      setAssigningId(complaintId);
      const updatedComplaint = await complaintsApi.assign(complaintId, memberId);
      setComplaints((current) => current.map((complaint) => (
        complaint.id === complaintId ? updatedComplaint : complaint
      )));
      toast({ title: "Complaint assigned", description: `${updatedComplaint.reference} is now assigned.` });
    } catch (err: any) {
      toast({ title: "Assignment failed", description: err.message || "Unable to assign complaint.", variant: "destructive" });
    } finally {
      setAssigningId(null);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((complaint) => complaint.status === "Pending").length;
  const assigned = complaints.filter((complaint) => complaint.status === "Assigned").length;
  const inProgress = complaints.filter((complaint) => complaint.status === "In Progress").length;
  const resolved = complaints.filter((complaint) => complaint.status === "Resolved").length;

  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
  const assignmentRate = total ? Math.round(((assigned + inProgress) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-6 lg:px-8">
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <Users className="h-3.5 w-3.5" />
                Department Command Center
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                {department || "Department"} Dashboard
              </h1>
              <p className="mt-3 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
                Real-time complaint workload, team capacity, and assignment performance for {department || "your department"}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Team Members</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{members.length}</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assignment Rate</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{assignmentRate}%</p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resolution Rate</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{resolutionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="glass-card">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-sm">Department Complaints</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No complaints in this department yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {complaints.map((complaint) => {
                const selectedMemberId = selectedOfficer[complaint.id] || complaint.assignedTo?.id || "";

                return (
                  <div key={complaint.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{complaint.reference}</span>
                          <StatusBadge status={complaint.status} />
                        </div>
                        <h3 className="font-medium text-foreground text-sm">{complaint.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{complaint.description}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mt-3 text-xs text-muted-foreground">
                          {complaint.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{complaint.location}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          <span>{complaint.createdBy?.name || "Citizen"}</span>
                          {complaint.assignedTo && <span className="text-foreground">Assigned to {complaint.assignedTo.name}</span>}
                        </div>
                      </div>

                      <div className="w-full lg:w-56 flex flex-col gap-2">
                        <Select
                          value={selectedMemberId}
                          onValueChange={(value) => setSelectedOfficer((current) => ({ ...current, [complaint.id]: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={members.length ? "Select officer" : "No officers added"} />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((member) => (
                              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={!members.length || assigningId === complaint.id}
                          onClick={() => handleAssign(complaint.id)}
                        >
                          {assigningId === complaint.id ? "Saving..." : complaint.assignedTo ? "Reassign" : "Assign"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              <h2 className="text-lg font-semibold text-foreground">Team Performance</h2>
              <p className="mt-1 text-sm text-muted-foreground">Officer assignment and workload overview.</p>
            </div>
            <Users className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-3">
            {members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                No team members added yet.
              </div>
            ) : (
              members.map((member, index) => {
                const memberComplaints = complaints.filter((c) => c.assignedTo?.id === member.id);
                const assignmentRate = memberComplaints.length > 0 ? Math.round((memberComplaints.length / complaints.length) * 100) : 0;

                return (
                  <div key={member.id} className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{memberComplaints.length} assigned</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {assignmentRate}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950/60">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${assignmentRate}%` }} />
                    </div>
                  </div>
                );
              })
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
              <h2 className="text-lg font-semibold text-foreground">Department Status</h2>
              <p className="mt-1 text-sm text-muted-foreground">Key metrics and workflow health checks.</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Total Complaints</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">{total}</p>
              <p className="mt-2 text-sm text-muted-foreground">All complaints routed to {department || "your department"}.</p>
            </div>

            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Pending Action</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">{pending}</p>
              <p className="mt-2 text-sm text-muted-foreground">Complaints awaiting assignment or action.</p>
            </div>

            <div className="holographic-card rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Recommended Action</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {pending > 0
                  ? `Prioritize assigning ${pending} pending complaint${pending !== 1 ? "s" : ""} to available team members.`
                  : "All complaints are assigned. Focus on resolution and follow-ups."}
              </p>
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default DepartmentDashboard;
