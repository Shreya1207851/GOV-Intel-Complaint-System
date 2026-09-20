import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { membersApi, MemberRecord } from "@/services/complaintsApi";
import { useToast } from "@/hooks/use-toast";

const Members: React.FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await membersApi.list();
        setMembers(data);
      } catch (_error) {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadMembers().catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);
      const newMember = await membersApi.create(name.trim());
      setMembers((current) => [newMember, ...current]);
      setName("");
      toast({ title: "Officer added", description: `${newMember.name} is now available for assignments.` });
    } catch (err: any) {
      toast({ title: "Unable to add officer", description: err.message || "Try again in a moment.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Members</h1>
        <p className="text-muted-foreground text-sm">Manage department officers for assignments</p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading">Add Officer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Enter officer name" value={name} onChange={(event) => setName(event.target.value)} />
          <Button onClick={handleAdd} className="w-full sm:w-32" disabled={saving}>
            {saving ? "Adding..." : "Add Member"}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading">Officers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && <div className="text-sm text-muted-foreground">Loading officers...</div>}
          {!loading && members.length === 0 && <div className="text-sm text-muted-foreground">No members yet.</div>}
          {members.map((member) => (
            <div key={member.id} className="p-3 rounded-lg border border-border bg-card/70 text-sm text-foreground">
              {member.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
