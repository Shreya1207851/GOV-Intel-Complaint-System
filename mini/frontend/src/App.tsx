import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/NotFound";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import RaiseComplaint from "./pages/citizen/RaiseComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetail from "./pages/citizen/ComplaintDetail";
import FeedbackForm from "./pages/citizen/FeedbackForm";
import DepartmentDashboard from "./pages/authority/AuthorityDashboard";
import FeedbackReceived from "./pages/authority/FeedbackReceived";
import AssignedComplaints from "./pages/authority/Assigned";
import Members from "./pages/authority/Members";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AIInsights from "./pages/admin/AIInsights";
import UserManagement from "./pages/admin/UserManagement";
import AuthorityApprovals from "./pages/admin/AuthorityApprovals";
import Landing from "./pages/Landing";
import Chatbot from "./components/shared/Chatbot";
import ProfileSettings from "./components/shared/ProfileSettings";
import NotificationsPage from "./pages/Notifications";
import AssistantPage from "./pages/Assistant";
import { SafeNotificationProvider } from "@/contexts/SafeNotificationContext";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", color: "red" }}>
          <h1>Application Error</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Citizen routes */}
        <Route path="/citizen" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><CitizenDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/new" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><RaiseComplaint /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/complaints" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><MyComplaints /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/complaints/:id" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><ComplaintDetail /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/complaints/:id/feedback" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><FeedbackForm /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/profile" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><ProfileSettings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/citizen/assistant" element={<ProtectedRoute roles={["citizen"]}><DashboardLayout><AssistantPage /></DashboardLayout></ProtectedRoute>} />

        {/* Department routes */}
        <Route path="/department" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><DepartmentDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/department/assigned" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><AssignedComplaints /></DashboardLayout></ProtectedRoute>} />
        <Route path="/department/members" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><Members /></DashboardLayout></ProtectedRoute>} />
        <Route path="/department/feedback" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><FeedbackReceived /></DashboardLayout></ProtectedRoute>} />
        <Route path="/department/profile" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><ProfileSettings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/department/assistant" element={<ProtectedRoute roles={["authority"]}><DashboardLayout><AssistantPage /></DashboardLayout></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/ai-insights" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><AIInsights /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><UserManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/authority-approvals" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><AuthorityApprovals /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><ProfileSettings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/assistant" element={<ProtectedRoute roles={["admin"]}><DashboardLayout><AssistantPage /></DashboardLayout></ProtectedRoute>} />

        <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuthenticated && <Chatbot />}
    </>
  );
};

const TestApp = () => (
  <div style={{
    padding: "20px",
    fontFamily: '"Inter", sans-serif',
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  }}>
    <h1 style={{ color: "#333" }}>✓ React is working!</h1>
    <p style={{ color: "#666" }}>The test component loaded successfully.</p>
    <p style={{ color: "#666", fontSize: "14px" }}>Loading full app...</p>
  </div>
);

const App = () => {
  const [testPhase, setTestPhase] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    try {
      timer = setTimeout(() => {
        console.log("Switching to main app");
        setTestPhase(false);
      }, 800);
    } catch (e) {
      setError(`Error: ${String(e)}`);
    }
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", fontFamily: "monospace" }}>
        <h2>Error Loading App</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (testPhase) {
    return <TestApp />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <SafeNotificationProvider>
                  <AppRoutes />
                </SafeNotificationProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
