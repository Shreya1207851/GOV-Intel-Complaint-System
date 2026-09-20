import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { complaintsApi, ComplaintRecord } from "@/services/complaintsApi";

const FeedbackReceived: React.FC = () => {
  const [complaintsWithFeedback, setComplaintsWithFeedback] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const complaints = await complaintsApi.listDepartment();
        setComplaintsWithFeedback(complaints.filter((complaint) => Boolean(complaint.feedback)));
      } catch (_error) {
        setComplaintsWithFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback().catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Feedback Received</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Citizen evaluations on resolved complaints</p>
      </div>

      {loading ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">Loading feedback...</CardContent>
        </Card>
      ) : complaintsWithFeedback.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">No feedback received yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaintsWithFeedback.map((complaint, index) => (
            <motion.div key={complaint.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{complaint.reference}</p>
                      <h3 className="font-medium text-foreground">{complaint.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {complaint.createdBy?.name || "Citizen"} · {complaint.feedback ? new Date(complaint.feedback.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {complaint.feedback?.workCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-success"><CheckCircle className="w-4 h-4" /> Completed</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-destructive"><XCircle className="w-4 h-4" /> Not Complete</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quality Rating</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={cn("w-4 h-4", star <= (complaint.feedback?.rating || 0) ? "fill-warning text-warning" : "text-muted-foreground/20")} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Work Done</p>
                      <p className="text-sm font-bold text-foreground">{complaint.feedback?.percentDone || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Comments</p>
                      <p className="text-sm text-foreground/80">{complaint.feedback?.comment || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackReceived;
