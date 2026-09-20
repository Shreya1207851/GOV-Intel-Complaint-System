export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string; // Department for filtering
  status: "Pending" | "Assigned" | "submitted" | "in_progress" | "escalated" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  citizenId: string;
  citizenName: string;
  assignedTo?: string;
  assignedDept?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  aiClassification?: string;
  aiUrgencyScore?: number;
  aiSentiment?: string;
  attachments?: string[];
  imageUrl?: string;
  timeline?: TimelineEvent[];
  feedback?: ComplaintFeedback;
}

export interface ComplaintFeedback {
  workCompleted: boolean;
  qualityRating: number; // 1-5
  percentDone: number; // 0-100
  comments: string;
  proofImageUrl?: string;
  submittedAt: string;
}

export interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface AuthorityUser {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export const DEPARTMENT_CATEGORY_MAP: Record<string, string> = {
  Road: "Road & Infrastructure",
  "Road & Infrastructure": "Road & Infrastructure",
  "Water Supply": "Water Supply",
  Water: "Water Supply",
  "Electricity": "Electricity",
  Environment: "Environment",
  // Legacy mappings for backward compatibility
  "Roads & Infrastructure": "Road & Infrastructure",
  "Public Works": "Road & Infrastructure",
  "Water Board": "Water Supply",
  "Electricity Board": "Electricity",
  "Sanitation": "Road & Infrastructure", // Map to Road & Infrastructure as per requirements
  "Sanitation Dept": "Road & Infrastructure",
  "Environment Dept": "Environment",
  "Public Safety": "Road & Infrastructure",
  "Police": "Road & Infrastructure",
  "Healthcare": "Road & Infrastructure",
  "Health Dept": "Road & Infrastructure",
  "Education": "Road & Infrastructure",
  "Education Dept": "Road & Infrastructure",
  "Transport": "Road & Infrastructure",
  "Transport Authority": "Road & Infrastructure",
  "Other": "Road & Infrastructure",
};

export const MOCK_AUTHORITY_REQUESTS: AuthorityUser[] = [
  { id: "ar1", name: "Suresh Mehta", email: "suresh@gov.in", department: "Electricity", status: "pending", appliedAt: "2024-12-14T10:00:00Z" },
  { id: "ar2", name: "Anita Desai", email: "anita@gov.in", department: "Water Supply", status: "pending", appliedAt: "2024-12-13T08:30:00Z" },
  { id: "ar3", name: "Ravi Shankar", email: "ravi@gov.in", department: "Road & Infrastructure", status: "approved", appliedAt: "2024-12-10T12:00:00Z", reviewedAt: "2024-12-11T09:00:00Z", reviewedBy: "Vikram Patel" },
  { id: "ar4", name: "Kavita Joshi", email: "kavita@gov.in", department: "Environment", status: "rejected", appliedAt: "2024-12-09T14:00:00Z", reviewedAt: "2024-12-10T11:00:00Z", reviewedBy: "Vikram Patel" },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "CMP-2024-001",
    title: "Pothole on MG Road near Junction 5",
    description: "Large pothole causing accidents. Multiple vehicles damaged in the past week.",
    category: "Road",
    department: "Road & Infrastructure",
    status: "Assigned",
    priority: "high",
    citizenId: "u1",
    citizenName: "Aarav Sharma",
    assignedTo: "Priya Nair",
    assignedDept: "Road & Infrastructure",
    location: "MG Road, Junction 5, Sector 12",
    createdAt: "2024-12-10T09:30:00Z",
    updatedAt: "2024-12-12T14:20:00Z",
    slaDeadline: "2024-12-17T09:30:00Z",
    aiClassification: "Infrastructure - Road Damage",
    aiUrgencyScore: 8.5,
    aiSentiment: "Frustrated",
    imageUrl: "/placeholder.svg",
    timeline: [
      { id: "t1", action: "Complaint Submitted", actor: "Aarav Sharma", timestamp: "2024-12-10T09:30:00Z" },
      { id: "t2", action: "AI Classification Complete", actor: "System", timestamp: "2024-12-10T09:31:00Z", note: "Category: Road Damage, Urgency: High" },
      { id: "t3", action: "Assigned to Road & Infrastructure", actor: "System", timestamp: "2024-12-10T09:32:00Z" },
      { id: "t4", action: "Status Updated", actor: "Priya Nair", timestamp: "2024-12-12T14:20:00Z", note: "Repair crew dispatched" },
    ],
  },
  {
    id: "CMP-2024-002",
    title: "Water supply disruption in Sector 7",
    description: "No water supply for 3 days. Entire neighbourhood affected. Tankers not arriving.",
    category: "Water",
    department: "Water Supply",
    status: "Assigned",
    priority: "critical",
    citizenId: "u1",
    citizenName: "Aarav Sharma",
    assignedTo: "Rajesh Kumar",
    assignedDept: "Water Supply",
    location: "Sector 7, Block C",
    createdAt: "2024-12-08T06:00:00Z",
    updatedAt: "2024-12-11T10:00:00Z",
    slaDeadline: "2024-12-11T06:00:00Z",
    aiClassification: "Utilities - Water Supply",
    aiUrgencyScore: 9.2,
    aiSentiment: "Angry",
    imageUrl: "/placeholder.svg",
    timeline: [
      { id: "t1", action: "Complaint Submitted", actor: "Aarav Sharma", timestamp: "2024-12-08T06:00:00Z" },
      { id: "t2", action: "Auto-escalated - SLA Breach", actor: "System", timestamp: "2024-12-11T06:01:00Z" },
    ],
  },
  {
    id: "CMP-2024-003",
    title: "Streetlights not working on Park Avenue",
    description: "Five streetlights not functioning. Safety concern for pedestrians at night.",
    category: "Electricity",
    department: "Electricity",
    status: "Pending",
    priority: "medium",
    citizenId: "u1",
    citizenName: "Aarav Sharma",
    location: "Park Avenue, Block D-E stretch",
    createdAt: "2024-12-13T18:00:00Z",
    updatedAt: "2024-12-13T18:00:00Z",
    slaDeadline: "2024-12-20T18:00:00Z",
    aiClassification: "Utilities - Street Lighting",
    aiUrgencyScore: 5.8,
    aiSentiment: "Concerned",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "CMP-2024-004",
    title: "Garbage not collected for a week",
    description: "No garbage collection in our area. Waste piling up, health hazard.",
    category: "Road",
    department: "Road & Infrastructure",
    status: "Assigned",
    priority: "high",
    citizenId: "u4",
    citizenName: "Meera Reddy",
    assignedTo: "Priya Nair",
    assignedDept: "Road & Infrastructure",
    location: "Rose Garden Colony, Sector 3",
    createdAt: "2024-12-01T07:00:00Z",
    updatedAt: "2024-12-05T16:00:00Z",
    slaDeadline: "2024-12-08T07:00:00Z",
    aiClassification: "Sanitation - Waste Collection",
    aiUrgencyScore: 7.0,
    aiSentiment: "Frustrated",
    imageUrl: "/placeholder.svg",
    feedback: {
      workCompleted: true,
      qualityRating: 4,
      percentDone: 90,
      comments: "Area cleaned well but one corner still has debris.",
      submittedAt: "2024-12-06T10:00:00Z",
    },
  },
  {
    id: "CMP-2024-005",
    title: "Noise pollution from construction site",
    description: "Construction work happening beyond permitted hours. Disturbing residents.",
    category: "Environment",
    department: "Environment",
    status: "Assigned",
    priority: "low",
    citizenId: "u5",
    citizenName: "Kiran Das",
    assignedTo: "Priya Nair",
    assignedDept: "Environment",
    location: "Industrial Area, Phase 2",
    createdAt: "2024-12-11T22:00:00Z",
    updatedAt: "2024-12-13T09:00:00Z",
    slaDeadline: "2024-12-18T22:00:00Z",
    aiClassification: "Environment - Noise",
    aiUrgencyScore: 4.2,
    aiSentiment: "Annoyed",
    imageUrl: "/placeholder.svg",
  },
];

export const CATEGORIES = [
  "Road",
  "Water",
  "Electricity",
  "Environment",
];

export const DEPARTMENTS = [
  "Road & Infrastructure",
  "Water Supply",
  "Electricity",
  "Environment",
];
