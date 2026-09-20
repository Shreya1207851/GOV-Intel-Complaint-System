import React from "react";
import { MOCK_COMPLAINTS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AuthorityPerformance: React.FC = () => {
  // Aggregate feedback by authority
  const feedbackByAuthority: Record<string, { name: string; dept: string; count: number; avgRating: number; avgPercent: number; completedCount: number }> = {};

  MOCK_COMPLAINTS.forEach((c) => {
    if (c.feedback && c.assignedTo) {
      if (!feedbackByAuthority[c.assignedTo]) {
        feedbackByAuthority[c.assignedTo] = { name: c.assignedTo, dept: c.assignedDept || "—", count: 0, avgRating: 0, avgPercent: 0, completedCount: 0 };
      }
      const a = feedbackByAuthority[c.assignedTo];
      a.count++;
      a.avgRating += c.feedback.qualityRating;
      a.avgPercent += c.feedback.percentDone;
      if (c.feedback.workCompleted) a.completedCount++;
    }
  });

  const authorities = Object.values(feedbackByAuthority).map((a) => ({
    ...a,
    avgRating: a.count > 0 ? a.avgRating / a.count : 0,
    avgPercent: a.count > 0 ? Math.round(a.avgPercent / a.count) : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Department Performance</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Based on citizen feedback on resolved complaints</p>
      </div>

      {authorities.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">No feedback data available yet.</CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {authorities.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.dept}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(a.avgRating) ? "fill-warning text-warning" : "text-muted-foreground/20")} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{a.avgRating.toFixed(1)} Avg Rating</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-sm font-bold text-foreground">{a.avgPercent}%</p>
                      <p className="text-xs text-muted-foreground">Avg Completion</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <CheckCircle className="w-4 h-4 text-success mx-auto mb-1" />
                      <p className="text-sm font-bold text-foreground">{a.completedCount}/{a.count}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
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

export default AuthorityPerformance;
