import React from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { ComplaintRecord } from "@/services/complaintsApi";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComplaintTableProps {
  complaints: ComplaintRecord[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(date));

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <section className="rounded-3xl border border-border/60 bg-card bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">Search and review the latest complaint activity across the system.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search complaint, category..."
              className="h-11 rounded-2xl border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] pl-10 shadow-none focus-visible:ring-primary/40"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] px-3 shadow-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="h-11 bg-transparent text-sm text-foreground outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <Button variant="outline" className="h-11 rounded-2xl border-border/60 bg-background/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_34%)] px-4">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border/60">
        <Table>
          <TableHeader className="bg-muted/45">
            <TableRow className="hover:bg-muted/45">
              <TableHead>Complaint ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No complaints match the current search and filter.
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((complaint) => (
                <TableRow key={complaint.id} className="border-blue-100/60 bg-transparent transition hover:bg-blue-50/50 dark:border-blue-900/30 dark:hover:bg-blue-950/20">
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">{complaint.reference}</TableCell>
                  <TableCell>
                    <div className="max-w-[320px]">
                      <p className="truncate font-medium text-foreground">{complaint.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{complaint.location || "Location not specified"}</p>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={complaint.status} /></TableCell>
                  <TableCell className="text-sm text-foreground">{complaint.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(complaint.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ComplaintTable;
