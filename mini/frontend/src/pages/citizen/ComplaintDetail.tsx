import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, User, Building, Brain, Clock, Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { complaintsApi, ComplaintRecord } from "@/services/complaintsApi";
import { cn } from "@/lib/utils";

const getUrgencyScore = (status: string) => {
  if (status === "Pending") return 7;
  if (status === "Assigned") return 6;
  if (status === "In Progress") return 5;
  return 3;
};

const ComplaintDetail: React.FC = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadComplaint = async () => {
      try {
        const data = await complaintsApi.getById(id);
        setComplaint(data);
      } catch (_error) {
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };

    loadComplaint().catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading complaint...</p>;
  }

  if (!complaint) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-heading font-bold text-foreground">Complaint not found</h2>
        <Link to="/citizen/complaints" className="text-primary hover:underline text-sm mt-2 block">Back to complaints</Link>
      </div>
    );
  }

  const urgencyScore = getUrgencyScore(complaint.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to complaints
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-mono text-muted-foreground">{complaint.reference}</span>
            <StatusBadge status={complaint.status} />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground">{complaint.title}</h1>
        </div>
        {complaint.status === "Resolved" && !complaint.feedback && (
          <Link to={`/citizen/complaints/${complaint.id}/feedback`}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Star className="w-4 h-4 mr-1" /> Give Feedback
            </Button>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80">{complaint.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{complaint.location || "Location not provided"}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{new Date(complaint.createdAt).toLocaleDateString()}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Building className="w-4 h-4" />{complaint.category}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" />{complaint.assignedTo?.name || "Unassigned"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Classification</p>
              <p className="text-sm font-medium text-foreground">{complaint.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Urgency Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", urgencyScore > 6 ? "bg-destructive" : urgencyScore > 4 ? "bg-warning" : "bg-success")}
                    style={{ width: `${(urgencyScore / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground">{urgencyScore}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Signal</p>
              <p className="text-sm font-medium text-foreground">{complaint.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {complaint.timeline.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaint.timeline.map((event, index) => (
                <motion.div
                  key={`${event.status}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                    {index < complaint.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{event.status}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                    {event.note && <p className="text-xs text-foreground/70 mt-1 bg-muted/50 px-2 py-1 rounded">{event.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {complaint.feedback && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Submitted Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn("w-4 h-4", star <= complaint.feedback!.rating ? "fill-warning text-warning" : "text-muted-foreground/30")} />
              ))}
            </div>
            <p className="text-sm text-foreground/80">{complaint.feedback.comment || "No additional comments provided."}</p>
            <p className="text-xs text-muted-foreground">
              Work completed: {complaint.feedback.workCompleted ? "Yes" : "No"} · {complaint.feedback.percentDone}% done
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplaintDetail;
