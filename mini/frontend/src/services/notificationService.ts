import type { User } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface ApiNotification {
  _id: string;
  userId?: string;
  role: User["role"];
  title: string;
  message: string;
  type: "ai" | "complaint" | "feedback" | "system";
  isRead: boolean;
  redirectUrl?: string;
  meta?: string;
  createdAt: string;
}

const buildHeaders = (user?: User): HeadersInit => ({
  "Content-Type": "application/json",
  ...(user ? { "x-user-id": user.id, "x-user-role": user.role } : {}),
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  if (response.status === 204) {
    return null as T;
  }
  return response.json() as Promise<T>;
};

export const getNotifications = async (user: User): Promise<ApiNotification[]> => {
  const params = new URLSearchParams({ role: user.role, userId: user.id });
  const response = await fetch(`${API_BASE_URL}/api/notifications?${params.toString()}`, {
    headers: buildHeaders(user),
  });
  return handleResponse<ApiNotification[]>(response);
};

export const markAsRead = async (user: User, id: string, read = true): Promise<ApiNotification> => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
    method: "PUT",
    headers: buildHeaders(user),
    body: JSON.stringify({ read }),
  });
  return handleResponse<ApiNotification>(response);
};

export const markAllAsRead = async (user: User): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
    method: "PUT",
    headers: buildHeaders(user),
  });
  await handleResponse(response);
};

export const clearNotifications = async (user: User): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/notifications/clear`, {
    method: "DELETE",
    headers: buildHeaders(user),
  });
  await handleResponse(response);
};
