import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Pending: { label: "Pending", className: "bg-muted text-muted-foreground border-border" },
  Assigned: { label: "Assigned", className: "bg-info/10 text-info border-info/20" },
  "In Progress": { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info border-info/20" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
  escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
  resolved: { label: "Resolved", className: "bg-success/10 text-success border-success/20" },
  Resolved: { label: "Resolved", className: "bg-success/10 text-success border-success/20" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", className: "bg-info/10 text-info border-info/20" },
  high: { label: "High", className: "bg-warning/10 text-warning border-warning/20" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};
