import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building2, Lock, Save, RotateCcw, Shield, Eye, EyeOff } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  citizen: "bg-primary/10 text-primary border-primary/20",
  authority: "bg-accent/10 text-accent-foreground border-accent/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
};

const ROLE_LABELS: Record<string, string> = {
  citizen: "Citizen",
  authority: "Department",
  admin: "Admin",
};

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    department: user?.department || "",
    organization: "",
  });

  const [passwords, setPasswords] = useState({ current: "", new_: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new_: false, confirm: false });
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Validation Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new_ || !passwords.confirm) {
      toast({ title: "Validation Error", description: "All password fields are required.", variant: "destructive" });
      return;
    }
    if (passwords.new_ !== passwords.confirm) {
      toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
      return;
    }
    if (passwords.new_.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setPasswords({ current: "", new_: "", confirm: "" });
    toast({ title: "Password Updated", description: "Your password has been changed successfully." });
  };

  const handleReset = () => {
    setForm({ name: user.name, phone: "", address: "", department: user.department || "", organization: "" });
    setPasswords({ current: "", new_: "", confirm: "" });
  };

  const PasswordField = ({ label, value, field }: { label: string; value: string; field: "current" | "new_" | "confirm" }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type={showPw[field] ? "text" : "password"}
          value={value}
          onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
          className="pl-10 pr-10"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details and security preferences.</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className={`mt-1 capitalize ${ROLE_COLORS[user.role]}`}>
                <Shield className="w-3 h-3 mr-1" />
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Update your personal details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={user.email} disabled className="pl-10 opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="pl-10" placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="pl-10" placeholder="Your address (optional)" />
            </div>
          </div>

          {(user.role === "authority" || user.role === "admin") && (
            <>
              {user.role === "authority" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Department</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="pl-10" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className="pl-10" placeholder="Organization name (optional)" />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordField label="Current Password" value={passwords.current} field="current" />
          <PasswordField label="New Password" value={passwords.new_} field="new_" />
          <PasswordField label="Confirm New Password" value={passwords.confirm} field="confirm" />
          <Button onClick={handlePasswordUpdate} disabled={saving} variant="secondary" className="gap-2 mt-2">
            <Lock className="w-4 h-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSettings;
