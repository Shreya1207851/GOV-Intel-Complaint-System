import { DEPARTMENTS } from "../config/departments";

// Guarded parse so a bad or missing localStorage value does not crash the app
const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Failed to parse localStorage value", error);
    return fallback;
  }
};

const getLocal = (key) => safeParse(localStorage.getItem(key), []);

const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const buildTimeline = (status) => [{ status, time: new Date().toISOString() }];

const DEFAULT_MEMBERS = ["Officer A", "Officer B"];

export const addNotification = (userId, role, message, type = "system", title = "Update") => {
  const notifications = getLocal("notifications");
  notifications.unshift({
    id: Date.now().toString(),
    userId,
    role,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
  setLocal("notifications", notifications);
};

export const addComplaint = (complaint, userId, citizenName = "Citizen") => {
  const normalizedCategory = complaint.category && DEPARTMENTS.includes(complaint.category) ? complaint.category : null;
  if (!normalizedCategory) return null;

  const complaints = getLocal("newComplaints");
  const newComplaint = {
    id: `CMP-${Date.now()}`,
    title: complaint.title,
    description: complaint.description,
    category: normalizedCategory,
    department: normalizedCategory,
    location: complaint.location,
    citizenName,
    citizenId: userId,
    status: "Pending",
    assignedTo: null,
    timeline: buildTimeline("Pending"),
    createdAt: new Date().toISOString(),
  };

  complaints.unshift(newComplaint);
  setLocal("newComplaints", complaints);

  addNotification(userId, "citizen", "Complaint filed successfully", "complaint", "Complaint Filed");
  addNotification("admin", "admin", "New complaint submitted", "complaint", "New Complaint");

  return newComplaint;
};

export const getDynamicComplaints = (userId) => getLocal("newComplaints").filter((c) => c.citizenId === userId);

export const getAllComplaints = () => getLocal("newComplaints");

export const getMembers = (department) => {
  const all = safeParse(localStorage.getItem("members"), {});
  const deptMembers = all[department] || [];
  return deptMembers.length ? deptMembers : DEFAULT_MEMBERS;
};

export const addMember = (name, department) => {
  const trimmed = (name || "").trim();
  if (!trimmed) return getMembers(department);
  const all = safeParse(localStorage.getItem("members"), {});
  if (!all[department]) all[department] = [];
  if (!all[department].includes(trimmed)) all[department].push(trimmed);
  localStorage.setItem("members", JSON.stringify(all));
  return getMembers(department);
};

export const toggleAssign = (id, officer) => {
  let complaints = getLocal("newComplaints");
  complaints = complaints.map((c) => {
    if (c.id === id) {
      if (c.assignedTo) {
        return {
          ...c,
          assignedTo: null,
          status: "Pending",
          timeline: [...(c.timeline || []), { status: "Pending", time: new Date().toISOString() }],
        };
      }
      return {
        ...c,
        assignedTo: officer,
        status: "Assigned",
        timeline: [...(c.timeline || []), { status: "Assigned", time: new Date().toISOString() }],
      };
    }
    return c;
  });
  setLocal("newComplaints", complaints);
};

export const assignComplaint = (id, departmentUser) => {
  let complaints = getLocal("newComplaints");
  complaints = complaints.map((c) => {
    if (c.id === id) {
      const updated = {
        ...c,
        status: "Assigned",
        assignedTo: departmentUser,
        timeline: [...(c.timeline || []), { status: "Assigned", time: new Date().toISOString() }],
      };
      addNotification(c.citizenId, "citizen", "Your complaint was assigned", "complaint", "Complaint Assigned");
      addNotification("admin", "admin", `Complaint ${id} assigned`, "system", "Assignment");
      return updated;
    }
    return c;
  });
  setLocal("newComplaints", complaints);
};

export const updateComplaintStatus = (id, status) => {
  let complaints = getLocal("newComplaints");
  complaints = complaints.map((c) => {
    if (c.id === id) {
      const updated = {
        ...c,
        status,
        timeline: [...(c.timeline || []), { status, time: new Date().toISOString() }],
      };
      addNotification(c.citizenId, "citizen", "Your complaint status updated", "complaint", "Status Updated");
      return updated;
    }
    return c;
  });
  setLocal("newComplaints", complaints);
};

export const getNotifications = (userId, role) => {
  const notifications = getLocal("notifications");
  if (role === "citizen") return notifications.filter((n) => n.userId === userId && n.role === "citizen");
  if (role === "department") return notifications.filter((n) => n.role === "department");
  if (role === "admin") return notifications.filter((n) => n.role === "admin");
  return [];
};

export const markNotification = (id, read = true) => {
  const notifications = getLocal("notifications").map((n) => (n.id === id ? { ...n, isRead: read } : n));
  setLocal("notifications", notifications);
};

export const markAllNotifications = (role, userId) => {
  const notifications = getLocal("notifications").map((n) => {
    if ((role === "citizen" && n.userId === userId) || (role === "department" && n.role === "department") || (role === "admin" && n.role === "admin")) {
      return { ...n, isRead: true };
    }
    return n;
  });
  setLocal("notifications", notifications);
};

export const clearNotifications = (role, userId) => {
  const notifications = getLocal("notifications").filter((n) => {
    if (role === "citizen") return !(n.userId === userId && n.role === "citizen");
    if (role === "department") return n.role !== "department";
    if (role === "admin") return n.role !== "admin";
    return true;
  });
  setLocal("notifications", notifications);
};
