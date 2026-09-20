import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNotifications, NOTIFICATION_ICON_MAP } from "@/contexts/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { getNotifications as getRuntimeNotifications } from "@/services/runtimeData";

const toneClasses = {
  info: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

type ToneKey = keyof typeof toneClasses;

const LOCAL_USER_ID = "user1";

type RuntimeNotification = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
};

type CombinedNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  link: string;
  icon: keyof typeof NOTIFICATION_ICON_MAP;
  tone: ToneKey;
  read: boolean;
  meta?: string;
  isRuntime?: boolean;
  runtimeId?: string;
};

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead, clearAll, markAsRead, loading } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [runtimeNotifications, setRuntimeNotifications] = React.useState<RuntimeNotification[]>([]);

  const refreshRuntimeNotifications = React.useCallback(() => {
    try {
      const data = getRuntimeNotifications(LOCAL_USER_ID);
      setRuntimeNotifications(data);
    } catch (error) {
      console.error("Failed to load local notifications", error);
    }
  }, []);

  React.useEffect(() => {
    refreshRuntimeNotifications();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "notifications") {
        refreshRuntimeNotifications();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshRuntimeNotifications]);

  const pruneRuntimeNotifications = React.useCallback((targetId?: string) => {
    try {
      const stored: RuntimeNotification[] = JSON.parse(localStorage.getItem("notifications") || "[]");
      const next = targetId
        ? stored.filter((notification) => notification.id !== targetId)
        : stored.filter((notification) => notification.userId !== LOCAL_USER_ID);
      localStorage.setItem("notifications", JSON.stringify(next));
      refreshRuntimeNotifications();
    } catch (error) {
      console.error("Failed to update local notifications", error);
    }
  }, [refreshRuntimeNotifications]);

  const runtimeFeed: CombinedNotification[] = React.useMemo(() => runtimeNotifications.map((notification) => ({
    id: `local-${notification.id}`,
    runtimeId: notification.id,
    title: "Complaint Update",
    message: notification.message,
    createdAt: notification.createdAt,
    link: "/citizen/complaints",
    icon: "file",
    tone: "success",
    read: false,
    meta: "Local",
    isRuntime: true,
  })), [runtimeNotifications]);

  const combinedNotifications: CombinedNotification[] = React.useMemo(() => (
    [...runtimeFeed, ...notifications]
  ), [runtimeFeed, notifications]);

  const totalUnread = unreadCount + runtimeFeed.length;

  const handleItemClick = (notification: CombinedNotification) => {
    if (notification.isRuntime && notification.runtimeId) {
      pruneRuntimeNotifications(notification.runtimeId);
    } else {
      markAsRead(notification.id);
    }
    setOpen(false);
    navigate(notification.link);
  };

  const handleMarkAll = () => {
    markAllAsRead();
    pruneRuntimeNotifications();
  };

  const handleClearAll = () => {
    clearAll();
    pruneRuntimeNotifications();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          <Bell className="w-5 h-5 text-current" />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] rounded-3xl border border-border/60 bg-card/95 p-0 shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div>
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">{totalUnread} new alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleMarkAll} className="text-xs font-medium text-primary hover:text-primary/80">Mark all</button>
            <button onClick={handleClearAll} className="text-xs font-medium text-muted-foreground hover:text-destructive">Clear</button>
          </div>
        </div>
        <ScrollArea className="max-h-80">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : combinedNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              You are all caught up.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {combinedNotifications.map((notification) => {
                const Icon = NOTIFICATION_ICON_MAP[notification.icon];
                const tone = toneClasses[notification.tone as ToneKey] ?? toneClasses.info;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleItemClick(notification)}
                    className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-muted/60 transition-colors"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", tone)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{notification.title}</p>
                        {!notification.read && <span className="inline-flex min-w-[8px] h-[8px] rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {notification.meta && (
                          <span className="text-[11px] font-medium text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted/80">
                            {notification.meta}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <div className="px-4 py-3 border-t border-border/60">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
            className="w-full text-sm font-semibold text-primary hover:text-primary/80"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
