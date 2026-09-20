import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  PlusCircle,
  UserCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/shared/Themetoggle";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import Navbar, { DashboardNavItem } from "@/components/dashboard/Navbar";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Record<UserRole, DashboardNavItem[]> = {
  citizen: [
    { label: "Dashboard", path: "/citizen", icon: LayoutDashboard },
    { label: "Complaints", path: "/citizen/complaints", icon: FileText },
    { label: "Raise", path: "/citizen/new", icon: PlusCircle },
    { label: "Assistant", path: "/citizen/assistant", icon: MessageSquareText },
    { label: "Settings", path: "/citizen/profile", icon: UserCircle },
  ],
  authority: [
    { label: "Dashboard", path: "/department", icon: LayoutDashboard },
    { label: "Complaints", path: "/department/assigned", icon: ClipboardList },
    { label: "Members", path: "/department/members", icon: Users },
    { label: "Feedback", path: "/department/feedback", icon: FileText },
    { label: "Assistant", path: "/department/assistant", icon: MessageSquareText },
    { label: "Settings", path: "/department/profile", icon: UserCircle },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Analytics", path: "/admin/ai-insights", icon: Brain },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Members", path: "/admin/authority-approvals", icon: UserCheck },
    { label: "Assistant", path: "/admin/assistant", icon: MessageSquareText },
    { label: "Settings", path: "/admin/profile", icon: UserCircle },
  ],
};

const PROFILE_PATHS: Record<UserRole, string> = {
  citizen: "/citizen/profile",
  authority: "/department/profile",
  admin: "/admin/profile",
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = NAV_ITEMS[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_20%)]">
      <Navbar
        navItems={navItems}
        user={user}
        activePath={location.pathname}
        role={user.role}
        onProfileClick={() => navigate(PROFILE_PATHS[user.role])}
        onLogout={handleLogout}
        rightActions={
          <>
            <ThemeToggle />
            <NotificationDropdown />
          </>
        }
      />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("min-w-0")}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
