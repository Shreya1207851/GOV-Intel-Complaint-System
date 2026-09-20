import React from "react";
import { MOCK_COMPLAINTS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Copy, Route, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const AI_SERVICES = [
  {
    name: "NLP Classification",
    icon: Brain,
    description: "Automatically categorizes complaints using natural language processing",
    status: "Active",
    accuracy: "94.2%",
  },
  {
    name: "Urgency Scoring",
    icon: Zap,
    description: "Scores complaint urgency based on sentiment and keyword analysis",
    status: "Active",
    accuracy: "91.8%",
  },
  {
    name: "Duplicate Detection",
    icon: Copy,
    description: "Identifies similar or duplicate complaints to prevent redundancy",
    status: "Active",
    accuracy: "88.5%",
  },
  {
    name: "Smart Routing",
    icon: Route,
    description: "Automatically routes complaints to the most appropriate department",
    status: "Active",
    accuracy: "92.1%",
  },
  {
    name: "Predictive Analytics",
    icon: Lightbulb,
    description: "Forecasts complaint trends and potential hotspots",
    status: "Beta",
    accuracy: "85.3%",
  },
];

const AIInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground text-sm mt-0.5">AI-powered analysis and service monitoring</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_SERVICES.map((svc, i) => (
          <motion.div key={svc.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <svc.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{svc.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-medium">{svc.status}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{svc.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-bold text-foreground">{svc.accuracy}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: svc.accuracy }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Recent AI Classifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {MOCK_COMPLAINTS.slice(0, 4).map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-primary">{c.aiClassification}</p>
                  <p className="text-xs text-muted-foreground">Urgency: {c.aiUrgencyScore} · {c.aiSentiment}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
