import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { io, type Socket } from "socket.io-client";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle,
  Brain,
  BellRing,
  Star,
  Activity,
  MessageCircle,
  UserCheck,
  Shield,
  Repeat,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  type ApiNotification,
  getNotifications as fetchNotifications,
  markAsRead as requestMarkAsRead,
  markAllAsRead as requestMarkAllAsRead,
  clearNotifications as requestClearNotifications,
} from "@/services/notificationService";

export const NOTIFICATION_ICON_MAP = {
  alert: AlertTriangle,
  brain: Brain,
  bell: BellRing,
  star: Star,
  activity: Activity,
  message: MessageCircle,
  user: UserCheck,
  shield: Shield,
  repeat: Repeat,
  chart: TrendingUp,
  file: FileText,
  check: CheckCircle2,
  clock: Clock3,
};

export type NotificationIconKey = keyof typeof NOTIFICATION_ICON_MAP;
export type NotificationCategory = "ai" | "complaint" | "feedback" | "system";
export type NotificationTone = "info" | "success" | "warning" | "critical";

const CATEGORY_UI_META: Record<NotificationCategory, {
  tone: NotificationTone;
  icon: NotificationIconKey;
  badge: string;
  fallbackLinks: Partial<Record<UserRole, string>>;
}> = {
  ai: {
    tone: "warning",
    icon: "brain",
    badge: "AI Alert",
    fallbackLinks: {
      citizen: "/citizen/complaints",
      authority: "/department/ai-insights",
      admin: "/admin/ai-insights",
    },
  },
  complaint: {
    tone: "info",
    icon: "file",
    badge: "Complaint",
    fallbackLinks: {
      citizen: "/citizen/complaints",
      authority: "/department/complaints",
      admin: "/admin/complaints",
    },
  },
  feedback: {
    tone: "success",
    icon: "star",
    badge: "Feedback",
    fallbackLinks: {
      citizen: "/citizen/complaints",
      authority: "/department/feedback",
      admin: "/admin/feedback",
    },
  },
  system: {
    tone: "info",
    icon: "shield",
    badge: "System",
    fallbackLinks: {
      citizen: "/citizen/profile",
      authority: "/department/profile",
      admin: "/admin",
    },
  },
};

export interface NotificationItem {
  id: string;
  userId?: string;
  role: UserRole;
  title: string;
  message: string;
  type: NotificationCategory;
  tone: NotificationTone;
  icon: NotificationIconKey;
  read: boolean;
  createdAt: string;
  link: string;
  meta?: string;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (notification: NotificationItem) => void;
  getByCategory: (category: NotificationCategory | "all") => NotificationItem[];
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const hydrateNotification = (item: ApiNotification): NotificationItem => {
  const uiMeta = CATEGORY_UI_META[item.type];
  const link = item.redirectUrl || uiMeta.fallbackLinks[item.role] || "/";
  return {
    id: item._id,
    userId: item.userId,
    role: item.role,
    title: item.title,
    message: item.message,
    type: item.type,
    tone: uiMeta.tone,
    icon: uiMeta.icon,
    read: item.isRead,
    createdAt: item.createdAt,
    link,
    meta: item.meta || uiMeta.badge,
  };
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchAndHydrate = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchNotifications(user);
      setNotifications(data.map(hydrateNotification));
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAndHydrate();
  }, [fetchAndHydrate]);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL, { transports: ["websocket"], autoConnect: true });
    }

    const socket = socketRef.current;
    const handleIncoming = (payload: ApiNotification) => {
      if (payload.role !== user.role) return;
      if (payload.userId && payload.userId !== user.id && user.role !== "admin") return;
      setNotifications((prev) => [hydrateNotification(payload), ...prev]);
    };

    socket.on("new-notification", handleIncoming);
    return () => {
      socket.off("new-notification", handleIncoming);
    };
  }, [user]);

  useEffect(() => () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  const updateReadState = useCallback((id: string, read: boolean) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read } : item)));
  }, []);

  const markAsRead = useCallback((id: string) => {
    if (!user) return;
    updateReadState(id, true);
    requestMarkAsRead(user, id, true).catch((error) => {
      console.error("Failed to mark as read", error);
      updateReadState(id, false);
    });
  }, [updateReadState, user]);

  const markAsUnread = useCallback((id: string) => {
    if (!user) return;
    updateReadState(id, false);
    requestMarkAsRead(user, id, false).catch((error) => {
      console.error("Failed to mark as unread", error);
      updateReadState(id, true);
    });
  }, [updateReadState, user]);

  const markAllAsRead = useCallback(() => {
    if (!user) return;
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    requestMarkAllAsRead(user).catch((error) => {
      console.error("Failed to mark all as read", error);
      fetchAndHydrate();
    });
  }, [fetchAndHydrate, user]);

  const clearAll = useCallback(() => {
    if (!user) return;
    const previous = notifications;
    setNotifications([]);
    requestClearNotifications(user).catch((error) => {
      console.error("Failed to clear notifications", error);
      setNotifications(previous);
    });
  }, [notifications, user]);

  const addNotification = useCallback((notification: NotificationItem) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const getByCategory = useCallback((category: NotificationCategory | "all") => {
    if (category === "all") return notifications;
    return notifications.filter((item) => item.type === category);
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAll,
    addNotification,
    getByCategory,
  }), [notifications, unreadCount, loading, markAsRead, markAsUnread, markAllAsRead, clearAll, addNotification, getByCategory]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
