// Department configuration for the Authority-based system
export const DEPARTMENTS = [
  "Road & Infrastructure",
  "Water Supply",
  "Electricity",
  "Environment",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

// Department metadata with emojis and icons for visual distinction
export const DEPARTMENT_METADATA: Record<Department, { emoji: string; icon: string; color: string }> = {
  "Road & Infrastructure": { emoji: "🛣️", icon: "road", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  "Water Supply": { emoji: "💧", icon: "droplet", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400" },
  "Electricity": { emoji: "⚡", icon: "zap", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
  "Environment": { emoji: "🌱", icon: "leaf", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
};
