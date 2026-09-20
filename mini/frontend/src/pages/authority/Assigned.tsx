import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { complaintsApi, ComplaintRecord } from "@/services/complaintsApi";

const FILTERS = ["Assigned", "Pending", "In Progress", "Resolved"] as const;

const AssignedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [activeOfficer, setActiveOfficer] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Assigned");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await complaintsApi.listDepartment();
        setComplaints(data);
      } catch (_error) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints().catch(() => setLoading(false));
  }, []);

  const groupedByOfficer = useMemo(() => {
    const grouped: Record<string, ComplaintRecord[]> = {};
    complaints.forEach((complaint) => {
      const officer = complaint.assignedTo?.name;
      if (!officer) return;
      if (!grouped[officer]) grouped[officer] = [];
      grouped[officer].push(complaint);
    });
    return grouped;
  }, [complaints]);

  const officers = Object.keys(groupedByOfficer);

  useEffect(() => {
    if (!activeOfficer && officers.length) {
      setActiveOfficer(officers[0]);
    }
  }, [officers, activeOfficer]);

  const officerComplaints = activeOfficer ? groupedByOfficer[activeOfficer] || [] : [];
  const filteredComplaints = officerComplaints.filter((complaint) => complaint.status === filter);

  const handleStatusChange = async (id: string, status: string) => {
    const updatedComplaint = await complaintsApi.updateStatus(id, status);
    setComplaints((current) => current.map((complaint) => (
      complaint.id === id ? updatedComplaint : complaint
    )));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Complaints</h1>
        <p className="text-muted-foreground text-sm">Officer-based complaint management</p>
      </div>

      {loading && (
        <Card className="glass-card">
          <CardContent className="p-4 text-sm text-muted-foreground">Loading complaints...</CardContent>
        </Card>
      )}

      {!loading && officers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-4 text-sm text-muted-foreground">No assigned complaints yet.</CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {officers.map((officer) => {
          const list = groupedByOfficer[officer] || [];
          return (
            <Card key={officer} className="glass-card">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setActiveOfficer(officer)}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{officer}</p>
                  <p className="text-xs text-muted-foreground">{list.length} complaints</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeOfficer === officer ? "rotate-180" : ""}`} />
              </button>

              {activeOfficer === officer && (
                <div className="border-t border-border p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {FILTERS.map((value) => (
                      <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${filter === value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  {filteredComplaints.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No complaints for this officer in the selected status.</div>
                  ) : (
                    <div className="space-y-3">
                      {filteredComplaints.map((complaint, index) => (
                        <motion.div key={complaint.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="p-4 rounded-lg border border-border bg-card/80">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-mono text-muted-foreground">{complaint.reference}</span>
                                <StatusBadge status={complaint.status} />
                              </div>
                              <h3 className="font-medium text-foreground text-sm">{complaint.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{complaint.description}</p>
                              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mt-2 text-xs text-muted-foreground">
                                {complaint.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{complaint.location}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                <span>Category: {complaint.category}</span>
                              </div>
                            </div>
                            <div className="w-full lg:w-48 flex flex-col gap-2">
                              <select
                                value={complaint.status}
                                onChange={(event) => handleStatusChange(complaint.id, event.target.value)}
                                className="w-full rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground"
                              >
                                {FILTERS.map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AssignedComplaints;
