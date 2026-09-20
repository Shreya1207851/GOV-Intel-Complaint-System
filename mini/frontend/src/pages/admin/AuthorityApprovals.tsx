import React, { useState } from "react";
import { MOCK_AUTHORITY_REQUESTS, AuthorityUser } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Clock, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AuthorityApprovals: React.FC = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AuthorityUser[]>(MOCK_AUTHORITY_REQUESTS);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: action, reviewedAt: new Date().toISOString(), reviewedBy: "Vikram Patel" } : r
      )
    );
    toast({
      title: action === "approved" ? "Department Approved" : "Department Rejected",
      description: `The department account has been ${action}.`,
    });
  };

  const pending = requests.filter((r) => r.status === "pending");
  const reviewed = requests.filter((r) => r.status !== "pending");

  const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
    approved: { label: "Approved", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Department Approvals</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and approve department registration requests</p>
      </div>

      {/* Pending */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" /> Pending Requests ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No pending requests</div>
          ) : (
            <div className="divide-y divide-border">
              {pending.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Building className="w-3 h-3" /> {r.department}
                        <span className="ml-2">Applied: {new Date(r.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAction(r.id, "rejected")}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => handleAction(r.id, "approved")}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Shield className="w-4 h-4" /> Review History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reviewed.map((r) => {
              const sc = statusConfig[r.status];
              return (
                <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.email} · {r.department}</p>
                      {r.reviewedAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Reviewed by {r.reviewedBy} on {new Date(r.reviewedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", sc.className)}>{sc.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorityApprovals;
