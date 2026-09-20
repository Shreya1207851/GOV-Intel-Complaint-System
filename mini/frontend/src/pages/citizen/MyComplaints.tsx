import React from "react";
import { Link } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { complaintsApi } from "@/services/complaintsApi";

const MyComplaints: React.FC = () => {
  const [complaints, setComplaints] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadComplaints = async () => {
      try {
        const apiData = await complaintsApi.listMine();
        setComplaints(apiData);
      } catch (_err) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints().catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">My Complaints</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{complaints.length} complaints filed</p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading complaints...</p>}

      <div className="space-y-3">
        {complaints.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={`/citizen/complaints/${c.id}`}>
              <Card className="holographic-card rounded-3xl border border-border/60 bg-card p-0 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{c.reference}</span>
                        <StatusBadge status={c.status} />
                        {c.priority && <PriorityBadge priority={c.priority} />}
                      </div>
                      <h3 className="font-medium text-foreground truncate">{c.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location || "Location not provided"}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {c.aiUrgencyScore && (
                      <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">{c.aiUrgencyScore}</span>
                        <span className="text-[10px] text-muted-foreground">Urgency</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;
