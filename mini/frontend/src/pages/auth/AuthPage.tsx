import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "@/config/departments";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup";
type SignupRole = "citizen" | "authority";
type LoginRole = "citizen" | "authority";

interface AuthPageProps {
  initialMode: AuthMode;
}

const DEMO_CREDENTIALS_KEY = "govai_demo_credentials";

const DEMO_ACCOUNTS = [
  { label: "Citizen demo", email: "citizen@demo.com", role: "citizen" as const },
  {
    label: "Road department",
    email: "road@demo.com",
    role: "authority" as const,
    department: "Road & Infrastructure",
  },
  {
    label: "Water department",
    email: "water@demo.com",
    role: "authority" as const,
    department: "Water Supply",
  },
  {
    label: "Electricity department",
    email: "electricity@demo.com",
    role: "authority" as const,
    department: "Electricity",
  },
  {
    label: "Environment department",
    email: "environment@demo.com",
    role: "authority" as const,
    department: "Environment",
  },
  {
    label: "Lead department",
    email: "authority@demo.com",
    role: "authority" as const,
    department: "Road & Infrastructure",
  },
  { label: "Admin demo", email: "admin@demo.com", role: "admin" as const },
];

const signupOptions: {
  value: SignupRole;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  {
    value: "citizen",
    label: "Citizen",
    description: "Raise, track, and review civic complaints with transparent updates.",
    icon: Users,
  },
  {
    value: "authority",
    label: "Department",
    description: "Manage assigned issues, respond faster, and keep ward operations visible.",
    icon: Building2,
  },
];

const routeForRole = (role: UserRole) => {
  if (role === "authority") return "/department";
  return `/${role}`;
};

const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [rememberMe, setRememberMe] = React.useState(true);
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [showSignupPassword, setShowSignupPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [signupLoading, setSignupLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");
  const [signupError, setSignupError] = React.useState("");

  const [loginRole, setLoginRole] = React.useState<LoginRole>("citizen");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [signupRole, setSignupRole] = React.useState<SignupRole>("citizen");
  const [signupName, setSignupName] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupDepartment, setSignupDepartment] = React.useState(DEPARTMENTS[0] ?? "");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [signupConfirm, setSignupConfirm] = React.useState("");

  React.useEffect(() => {
    const savedDemo = sessionStorage.getItem(DEMO_CREDENTIALS_KEY);

    if (!savedDemo) return;

    try {
      const parsed = JSON.parse(savedDemo) as { email?: string; password?: string };
      if (parsed.email) setLoginEmail(parsed.email);
      if (parsed.password) setLoginPassword(parsed.password);
    } finally {
      sessionStorage.removeItem(DEMO_CREDENTIALS_KEY);
    }
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);

      if (!rememberMe) {
        sessionStorage.setItem("govai_last_user", user.email);
      }

      navigate(routeForRole(user.role));
    } catch (error: any) {
      setLoginError(error.message ?? "Unable to sign in right now.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    if (signupRole === "authority" && !signupDepartment) {
      setSignupError("Please select a department.");
      return;
    }

    setSignupLoading(true);
    try {
      await register(
        signupName,
        signupEmail,
        signupPassword,
        signupRole,
        signupRole === "authority" ? signupDepartment : undefined,
      );
      navigate(routeForRole(signupRole));
    } catch (error: any) {
      if (error.message === "AUTHORITY_PENDING") {
        toast({
          title: "Registration submitted",
          description: "Your department account is pending admin approval.",
        });
        navigate("/login");
        return;
      }

      setSignupError(error.message ?? "Unable to create your account.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    toast({
      title: `${provider} sign-in is not connected yet`,
      description: "The UI is ready, but the OAuth flow still needs backend wiring.",
    });
  };

  const handleDemoLogin = async (email: string) => {
    setLoginError("");
    setLoginLoading(true);

    try {
      const user = await login(email, "demo123");
      navigate(routeForRole(user.role));
    } catch (error: any) {
      setLoginError(error.message ?? "Demo sign-in is unavailable right now.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_22%)] bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.16),_transparent_28%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-400/20 dark:bg-blue-900/30 blur-3xl" />

        <div className="relative mx-auto min-h-screen max-w-[1380px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[34px] border border-border/60 bg-card/95 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:grid-cols-[0.92fr_1.08fr]">
            <section className="flex flex-col justify-between border-r border-border/60 bg-card px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-9">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>
                  <ThemeToggle className="rounded-full border border-border bg-background/90 text-foreground hover:bg-background" />
                </div>

                <div className="mt-8 sm:mt-12">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
                      G
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">GovAI</p>
                      <p className="font-heading text-xl font-bold text-foreground">Resolve</p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="mt-8"
                  >
                    <p className="text-sm font-medium text-muted-foreground">Go ahead and set up your account</p>
                    <h1 className="mt-3 max-w-[12ch] text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl">
                      Welcome back to better civic operations
                    </h1>
                    <p className="mt-4 max-w-[48ch] text-base leading-7 text-muted-foreground">
                      Sign in to continue, or create a citizen or department account from the same screen.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="mt-8 rounded-[30px] border border-border/70 bg-background/75 p-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:p-5"
                >
                  <div className="grid grid-cols-2 rounded-full bg-muted/60 p-1">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className={cn(
                        "rounded-full px-4 py-3 text-sm font-semibold transition-all",
                        initialMode === "login"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className={cn(
                        "rounded-full px-4 py-3 text-sm font-semibold transition-all",
                        initialMode === "signup"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Signup
                    </button>
                  </div>

                  {initialMode === "login" ? (
                    <form onSubmit={handleLogin} className="mt-5 space-y-4">
                      <div className="grid grid-cols-2 rounded-full bg-muted/60 p-1">
                        {signupOptions.map((option) => (
                          <button
                            key={`login-${option.value}`}
                            type="button"
                            onClick={() => setLoginRole(option.value)}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all",
                              loginRole === option.value
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-[22px] border border-blue-200/70 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                        {loginRole === "citizen"
                          ? "Citizen access for tracking complaints, updates, and feedback."
                          : "Department access for assigned queues, updates, and operational follow-through."}
                      </div>

                      {loginError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {loginError}
                        </div>
                      )}

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="login-email" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Email Address
                        </Label>
                        <div className="mt-2 flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(event) => setLoginEmail(event.target.value)}
                            placeholder={loginRole === "citizen" ? "name@email.com" : "officer@city.gov"}
                            className="h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                            required
                          />
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="login-password" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Password
                        </Label>
                        <div className="mt-2 flex items-center gap-3">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showLoginPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(event) => setLoginPassword(event.target.value)}
                            placeholder="Enter your password"
                            className="h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword((current) => !current)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Toggle password visibility"
                          >
                            {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-3">
                          <Checkbox
                            checked={rememberMe}
                            onCheckedChange={(value) => setRememberMe(value === true)}
                            className="h-5 w-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            toast({
                              title: "Forgot password flow not wired yet",
                              description: "This screen is updated, but password recovery still needs backend support.",
                            })
                          }
                          className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <Button
                        type="submit"
                        disabled={loginLoading}
                        className="h-12 w-full rounded-full bg-primary text-base text-white hover:bg-primary/90"
                      >
                        {loginLoading ? "Logging in..." : "Login"}
                      </Button>

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Working demo credentials</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Password for all demo accounts: <span className="font-mono text-foreground">demo123</span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3">
                          {DEMO_ACCOUNTS.filter((account) =>
                            account.role === "admin" ? true : account.role === loginRole,
                          ).map((account) => (
                            <button
                              key={account.email}
                              type="button"
                              onClick={() => handleDemoLogin(account.email)}
                              disabled={loginLoading}
                              className="flex items-center justify-between rounded-[18px] border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted/60 disabled:opacity-60"
                            >
                              <div>
                                <p className="text-sm font-semibold text-foreground">{account.label}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{account.email}</p>
                                {"department" in account && account.department && (
                                  <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">{account.department}</p>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Use now</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-background/75 px-3 text-sm text-muted-foreground">Or login with</span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {["Google", "Facebook"].map((provider) => (
                            <button
                              key={provider}
                              type="button"
                              onClick={() => handleSocialClick(provider)}
                              className="inline-flex items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
                            >
                              <span
                                className={cn(
                                  "h-3 w-3 rounded-full",
                                  provider === "Google" ? "bg-primary" : "bg-blue-500",
                                )}
                              />
                              {provider}
                            </button>
                          ))}
                        </div>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="mt-5 space-y-4">
                      <div className="grid grid-cols-2 rounded-full bg-muted/60 p-1">
                        {signupOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSignupRole(option.value)}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all",
                              signupRole === option.value
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-[22px] border border-blue-200/70 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                        {signupOptions.find((option) => option.value === signupRole)?.description}
                      </div>

                      {signupError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {signupError}
                        </div>
                      )}

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="signup-name" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Full Name
                        </Label>
                        <Input
                          id="signup-name"
                          value={signupName}
                          onChange={(event) => setSignupName(event.target.value)}
                          placeholder="Your full name"
                          className="mt-2 h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                          required
                        />
                      </div>

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Email Address
                        </Label>
                        <div className="mt-2 flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            value={signupEmail}
                            onChange={(event) => setSignupEmail(event.target.value)}
                            placeholder={signupRole === "citizen" ? "name@email.com" : "officer@city.gov"}
                            className="h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                            required
                          />
                        </div>
                      </div>

                      {signupRole === "authority" && (
                        <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                          <Label htmlFor="signup-department" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Department
                          </Label>
                          <Select value={signupDepartment} onValueChange={setSignupDepartment}>
                            <SelectTrigger
                              id="signup-department"
                              className="mt-2 h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus:ring-0 focus:ring-offset-0"
                            >
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEPARTMENTS.map((department) => (
                                <SelectItem key={department} value={department}>
                                  {department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Password
                        </Label>
                        <div className="mt-2 flex items-center gap-3">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showSignupPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(event) => setSignupPassword(event.target.value)}
                            placeholder="Create a secure password"
                            className="h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword((current) => !current)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Toggle password visibility"
                          >
                            {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border/80 bg-card px-4 py-3">
                        <Label htmlFor="signup-confirm" className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Confirm Password
                        </Label>
                        <div className="mt-2 flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            value={signupConfirm}
                            onChange={(event) => setSignupConfirm(event.target.value)}
                            placeholder="Repeat your password"
                            className="h-auto border-0 bg-transparent px-0 py-0 text-base font-medium text-foreground shadow-none focus-visible:ring-0"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {signupRole === "authority" && (
                        <div className="rounded-[22px] border border-amber-200/70 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                          Department accounts require admin approval before access is activated.
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={signupLoading}
                        className="h-12 w-full rounded-full bg-primary text-base text-white hover:bg-primary/90"
                      >
                        {signupLoading
                          ? "Creating account..."
                          : `Create ${signupRole === "citizen" ? "Citizen" : "Department"} account`}
                        {!signupLoading && <ArrowRight className="ml-1 h-4 w-4" />}
                      </Button>
                    </form>
                  )}
                </motion.div>
              </div>

            </section>

            <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)] bg-background lg:flex">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />

              <div className="relative flex w-full items-center justify-center p-10 xl:p-14">
                <div className="relative w-full max-w-[580px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute right-2 top-0 w-[220px] rounded-[30px] border border-border/60 bg-card/95 p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Citizen queue</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">2.4x</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Faster first response when issues are categorized and routed before review.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
                    className="mx-auto mt-28 w-[360px] rounded-[42px] bg-primary p-8 text-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] xl:w-[420px]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">GovAI secure</p>
                        <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Unified civic access</h2>
                      </div>
                      <div className="rounded-full bg-white/10 p-4">
                        <Landmark className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4">
                      <div className="rounded-[24px] bg-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">Complaint intake</span>
                          <span className="text-sm font-semibold">94%</span>
                        </div>
                        <div className="mt-4 flex h-16 items-end gap-2">
                          {[28, 55, 40, 68, 82].map((bar) => (
                            <div key={bar} className="flex-1 rounded-t-2xl bg-blue-300/80" style={{ height: `${bar}%` }} />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[24px] bg-blue-100 p-4 text-foreground dark:bg-blue-900/35 dark:text-blue-100">
                          <Sparkles className="h-6 w-6" />
                          <p className="mt-8 text-3xl font-semibold tracking-[-0.05em]">23k+</p>
                          <p className="mt-2 text-sm leading-6 text-foreground/75">Resolution journeys tracked</p>
                        </div>
                        <div className="rounded-[24px] border border-border/60 bg-card/95 p-4 text-foreground backdrop-blur">
                          <Shield className="h-6 w-6" />
                          <p className="mt-8 text-3xl font-semibold tracking-[-0.05em]">Live</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">Citizen, department, and admin flows on one system</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
                    className="absolute bottom-6 left-0 w-[240px] rounded-[30px] border border-border/60 bg-card/95 p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Department signup</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">Admin approval stays intact</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      New department requests still route through approval before access is granted.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
