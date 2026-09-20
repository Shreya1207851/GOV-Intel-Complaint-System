import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi, AuthApiUser } from "@/services/authApi";

export type UserRole = "citizen" | "authority" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  status?: "active" | "pending" | "rejected";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<User>;
  register: (name: string, email: string, password: string, role: UserRole, department?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_USER_KEY = "govai_user";
const STORAGE_TOKEN_KEY = "govai_token";

const mapServerRoleToClient = (role: AuthApiUser["role"]): UserRole => (
  role === "department" ? "authority" : role
);

const mapClientRoleToServer = (role: UserRole): AuthApiUser["role"] => (
  role === "authority" ? "department" : role
);

const normalizeUser = (user: (Partial<User> & { role?: string }) | null): User | null => {
  if (!user?.id || !user?.email || !user?.name || !user?.role) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: mapServerRoleToClient(user.role as AuthApiUser["role"]),
    department: user.department,
    avatar: user.avatar,
    status: user.status,
  };
};

const toClientUser = (user: AuthApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: mapServerRoleToClient(user.role),
  department: user.department || undefined,
  status: user.status,
});

const persistSession = (nextUser: User, token: string) => {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });

  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    const response = await authApi.login({ email, password });
    const nextUser = toClientUser(response.user);

    if (role && nextUser.role !== role) {
      throw new Error(`This account is registered as ${nextUser.role}, not ${role}.`);
    }

    if (!response.token) {
      throw new Error("Authentication token missing from server response.");
    }

    setUser(nextUser);
    persistSession(nextUser, response.token);
    return nextUser;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole, department?: string) => {
    if (role === "admin") throw new Error("Admin registration is not allowed.");

    const response = await authApi.register({
      name,
      email,
      password,
      role: mapClientRoleToServer(role),
      department,
    });

    const nextUser = toClientUser(response.user);

    if (nextUser.role === "authority" && nextUser.status === "pending") {
      throw new Error("AUTHORITY_PENDING");
    }

    if (!response.token) {
      throw new Error(response.message || "Registration succeeded but no login session was created.");
    }

    setUser(nextUser);
    persistSession(nextUser, response.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
