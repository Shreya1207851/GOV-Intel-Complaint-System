import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_USERS = [
  { id: "u1", name: "Aarav Sharma", email: "citizen@demo.com", role: "citizen", status: "active", complaints: 3 },
  { id: "u2", name: "Priya Nair", email: "authority@demo.com", role: "authority", status: "active", complaints: 0, department: "Road & Infrastructure" },
  { id: "u3", name: "Vikram Patel", email: "admin@demo.com", role: "admin", status: "active", complaints: 0 },
  { id: "u4", name: "Meera Reddy", email: "meera@demo.com", role: "citizen", status: "active", complaints: 1 },
  { id: "u5", name: "Kiran Das", email: "kiran@demo.com", role: "citizen", status: "inactive", complaints: 1 },
  { id: "u6", name: "Rajesh Kumar", email: "water@demo.com", role: "authority", status: "active", complaints: 0, department: "Water Supply" },
];

const ROLE_COLORS: Record<string, string> = {
  citizen: "bg-info/10 text-info border-info/20",
  authority: "bg-warning/10 text-warning border-warning/20",
  admin: "bg-primary/10 text-primary border-primary/20",
};

const ROLE_LABELS: Record<string, string> = {
  citizen: "Citizen",
  authority: "Department",
  admin: "Admin",
};

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{MOCK_USERS.length} users registered</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Department</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_USERS.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={`text-xs capitalize ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs font-medium ${u.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                        {u.status === "active" ? "● Active" : "● Inactive"}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">
                      {(u as any).department || "—"}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm"><Edit className="w-3.5 h-3.5" /></Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
