import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Map, Filter, AlertTriangle, Info } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";

/* ── Mock geo-data for city complaint hotspots ── */
interface HotspotData {
  id: string;
  area: string;
  sector: string;
  lat: number; // relative % position on the mock map
  lng: number;
  count: number;
  dominant: string;
  priority: "critical" | "high" | "medium" | "low";
}

const MOCK_HOTSPOTS: HotspotData[] = [
  { id: "h1", area: "MG Road", sector: "Sector 12", lat: 28, lng: 38, count: 14, dominant: "Roads & Infrastructure", priority: "critical" },
  { id: "h2", area: "Sector 7", sector: "Block C", lat: 45, lng: 22, count: 9, dominant: "Water Supply", priority: "critical" },
  { id: "h3", area: "Park Avenue", sector: "Block D-E", lat: 60, lng: 55, count: 5, dominant: "Electricity", priority: "medium" },
  { id: "h4", area: "Rose Garden", sector: "Sector 3", lat: 35, lng: 68, count: 7, dominant: "Sanitation", priority: "high" },
  { id: "h5", area: "Industrial Area", sector: "Phase 2", lat: 72, lng: 42, count: 4, dominant: "Environment", priority: "low" },
  { id: "h6", area: "City Centre", sector: "Main Bazaar", lat: 50, lng: 50, count: 11, dominant: "Roads & Infrastructure", priority: "critical" },
  { id: "h7", area: "Old Town", sector: "Heritage Zone", lat: 20, lng: 60, count: 3, dominant: "Public Safety", priority: "medium" },
  { id: "h8", area: "North Campus", sector: "University Rd", lat: 15, lng: 35, count: 6, dominant: "Transport", priority: "high" },
  { id: "h9", area: "Green Valley", sector: "Phase 4", lat: 80, lng: 70, count: 2, dominant: "Sanitation", priority: "low" },
  { id: "h10", area: "East Market", sector: "Nehru Marg", lat: 55, lng: 78, count: 8, dominant: "Water Supply", priority: "high" },
  { id: "h11", area: "West End", sector: "Residency", lat: 42, lng: 15, count: 12, dominant: "Roads & Infrastructure", priority: "critical" },
  { id: "h12", area: "Central Park", sector: "Sector 1", lat: 65, lng: 32, count: 5, dominant: "Environment", priority: "medium" },
];

const PRIORITY_COLORS: Record<HotspotData["priority"], { bg: string; border: string; label: string; ring: string }> = {
  critical: { bg: "bg-destructive", border: "border-destructive", label: "Critical", ring: "ring-destructive/40" },
  high:     { bg: "bg-warning",     border: "border-warning",     label: "High",     ring: "ring-warning/40" },
  medium:   { bg: "bg-info",        border: "border-info",        label: "Medium",   ring: "ring-info/40" },
  low:      { bg: "bg-success",     border: "border-success",     label: "Low",      ring: "ring-success/40" },
};

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "This Year"];

const HeatmapView: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterDate, setFilterDate] = useState("Last 30 Days");

  const filtered = MOCK_HOTSPOTS.filter(
    (h) => filterCategory === "All Categories" || h.dominant === filterCategory
  );

  const dotSize = (count: number) => {
    if (count >= 12) return 40;
    if (count >= 8) return 32;
    if (count >= 5) return 24;
    return 18;
  };

  const summary = {
    critical: filtered.filter((h) => h.priority === "critical").length,
    high: filtered.filter((h) => h.priority === "high").length,
    medium: filtered.filter((h) => h.priority === "medium").length,
    low: filtered.filter((h) => h.priority === "low").length,
    total: filtered.reduce((s, h) => s + h.count, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Complaint Heatmap</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Geographic density of civic complaints across the city</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground">
            <Map className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
            >
              {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as const).map((p) => {
          const c = PRIORITY_COLORS[p];
          return (
            <motion.div key={p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${c.bg} shrink-0`} />
                  <div>
                    <p className="text-lg font-heading font-bold text-foreground">{summary[p]}</p>
                    <p className="text-xs text-muted-foreground">{c.label} zones</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Map + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Mock Map Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <Map className="w-4 h-4 text-primary" /> City Complaint Map
                <span className="ml-auto text-xs text-muted-foreground font-normal">{summary.total} total complaints · {filtered.length} zones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Map container */}
              <div
                className="relative w-full bg-gradient-to-br from-muted/40 to-muted/20 border-t border-border overflow-hidden"
                style={{ height: 440 }}
                onClick={() => setSelectedHotspot(null)}
              >
                {/* Grid lines to simulate map */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Road lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6,4" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6,4" />
                  <line x1="0" y1="30%" x2="100%" y2="70%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,6" />
                  <line x1="25%" y1="0" x2="75%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4,6" />
                </svg>

                {/* Area labels */}
                {["Downtown", "Uptown", "Suburbs", "Industrial"].map((label, i) => (
                  <span
                    key={label}
                    className="absolute text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest pointer-events-none select-none"
                    style={{
                      top: `${[15, 55, 70, 80][i]}%`,
                      left: `${[60, 15, 60, 35][i]}%`,
                    }}
                  >
                    {label}
                  </span>
                ))}

                {/* Hotspot markers */}
                {filtered.map((h) => {
                  const c = PRIORITY_COLORS[h.priority];
                  const size = dotSize(h.count);
                  const isSelected = selectedHotspot?.id === h.id;
                  return (
                    <motion.button
                      key={h.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedHotspot(h); }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-white font-bold font-heading cursor-pointer transition-all duration-200 ${c.bg} ${isSelected ? `ring-4 ${c.ring} scale-125` : "hover:scale-110 ring-2 ring-background/50"}`}
                      style={{
                        top: `${h.lat}%`,
                        left: `${h.lng}%`,
                        width: size,
                        height: size,
                        fontSize: size > 28 ? 11 : 9,
                        opacity: isSelected ? 1 : 0.88,
                      }}
                      title={`${h.area}: ${h.count} complaints`}
                    >
                      {h.count}
                    </motion.button>
                  );
                })}

                {/* Tooltip popup */}
                {selectedHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-72 z-10 p-4 rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-heading font-bold text-foreground text-sm">{selectedHotspot.area}</p>
                        <p className="text-xs text-muted-foreground">{selectedHotspot.sector}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-primary-foreground ${PRIORITY_COLORS[selectedHotspot.priority].bg}`}>
                        {PRIORITY_COLORS[selectedHotspot.priority].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-muted/40">
                        <p className="text-muted-foreground">Total Complaints</p>
                        <p className="font-bold text-foreground text-base mt-0.5">{selectedHotspot.count}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <p className="text-muted-foreground">Dominant Category</p>
                        <p className="font-semibold text-foreground mt-0.5 leading-tight">{selectedHotspot.dominant}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar – ranked list */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" /> Hotspot Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[460px] overflow-y-auto">
                {[...filtered]
                  .sort((a, b) => b.count - a.count)
                  .map((h, i) => {
                    const c = PRIORITY_COLORS[h.priority];
                    return (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHotspot(selectedHotspot?.id === h.id ? null : h)}
                        className={`w-full text-left p-3 hover:bg-muted/40 transition-colors flex items-center gap-3 ${selectedHotspot?.id === h.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                      >
                        <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{h.area}</p>
                          <p className="text-xs text-muted-foreground truncate">{h.dominant}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">{h.count}</p>
                          <span className={`text-[10px] font-semibold ${c.label === "Critical" ? "text-destructive" : c.label === "High" ? "text-warning" : c.label === "Medium" ? "text-info" : "text-success"}`}>
                            {c.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Legend */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Severity Legend</span>
            </div>
            {(["critical", "high", "medium", "low"] as const).map((p) => (
              <div key={p} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${PRIORITY_COLORS[p].bg}`} />
                <span className="text-xs text-muted-foreground capitalize">{p}</span>
              </div>
            ))}
            <div className="ml-auto text-xs text-muted-foreground">
              Circle size = complaint volume · Click a marker for details
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapView;
