import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNotifications, NOTIFICATION_ICON_MAP, NotificationCategory } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const FILTERS: { label: string; value: NotificationCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "AI Alerts", value: "ai" },
  { label: "Complaints", value: "complaint" },
  { label: "Feedback", value: "feedback" },
  { label: "System", value: "system" },
];

const toneClasses = {
  info: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

type ToneKey = keyof typeof toneClasses;

const categoryPills: Record<NotificationCategory, string> = {
  ai: "AI Insight",
  complaint: "Complaint",
  feedback: "Feedback",
  system: "System",
};

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, getByCategory, markAsRead, markAsUnread, markAllAsRead, clearAll, loading } = useNotifications();
  const [filter, setFilter] = React.useState<NotificationCategory | "all">("all");

  const filtered = getByCategory(filter);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">{notifications.length} total alerts across AI, complaints, feedback, and system health.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="ghost" onClick={clearAll} className="text-destructive hover:text-destructive">
            Clear all
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full border",
              filter === item.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center text-muted-foreground">
            Loading notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center text-muted-foreground">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((notification) => {
            const Icon = NOTIFICATION_ICON_MAP[notification.icon];
            const tone = toneClasses[notification.tone as ToneKey] ?? toneClasses.info;
            const isRead = notification.read;
            return (
              <article
                key={notification.id}
                className={cn("rounded-2xl border bg-card/60 glass-card p-4 flex flex-col gap-3", isRead ? "opacity-80" : "shadow-lg shadow-primary/5")}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", tone)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{notification.title}</h3>
                      {!isRead && <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-[11px] font-medium text-primary">New</span>}
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
                        {categoryPills[notification.type]}
                      </span>
                      {notification.meta && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/80 text-muted-foreground">
                          {notification.meta}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(notification.link)}
                      >
                        View details
                      </Button>
                      {isRead ? (
                        <Button size="sm" variant="ghost" onClick={() => markAsUnread(notification.id)}>
                          Mark as unread
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
        <h4 className="text-sm font-semibold text-foreground mb-1">How AI alerts work</h4>
        <p className="text-sm text-muted-foreground">
          Our AI watches for SLA breaches, complaint surges, duplicate filings, and sentiment drops in real time. Alerts are prioritized so you
          only see the issues that need attention first.
        </p>
      </div>
    </section>
  );
};

export default NotificationsPage;
