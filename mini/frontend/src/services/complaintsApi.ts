import { apiClient } from "./apiClient";

export interface ComplaintPayload {
  title: string;
  description: string;
  category: string;
  location?: string;
  image?: string;
}

export interface MemberRecord {
  id: string;
  _id?: string;
  name: string;
  department: string;
}

export interface FeedbackRecord {
  id: string;
  rating: number;
  comment?: string;
  image?: string;
  workCompleted: boolean;
  percentDone: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ComplaintTimelineEntry {
  status: string;
  timestamp: string;
  note?: string;
}

export interface ComplaintRecord {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: MemberRecord | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string | null;
  } | null;
  feedback?: FeedbackRecord | null;
  timeline: ComplaintTimelineEntry[];
}

const buildReference = (id: string) => `CMP-${id.slice(-6).toUpperCase()}`;

export const normalizeComplaint = (complaint: any): ComplaintRecord => {
  const id = complaint?._id || complaint?.id || "";

  return {
    id,
    reference: complaint?.reference || buildReference(id),
    title: complaint?.title || "",
    description: complaint?.description || "",
    category: complaint?.category || "",
    status: complaint?.status || "Pending",
    location: complaint?.location || "",
    image: complaint?.image || "",
    createdAt: complaint?.createdAt || new Date().toISOString(),
    updatedAt: complaint?.updatedAt,
    assignedTo: complaint?.assignedTo
      ? {
          id: complaint.assignedTo._id || complaint.assignedTo.id,
          _id: complaint.assignedTo._id,
          name: complaint.assignedTo.name,
          department: complaint.assignedTo.department,
        }
      : null,
    createdBy: complaint?.createdBy
      ? {
          id: complaint.createdBy._id || complaint.createdBy.id,
          name: complaint.createdBy.name,
          email: complaint.createdBy.email,
          role: complaint.createdBy.role,
          department: complaint.createdBy.department,
        }
      : null,
    feedback: complaint?.feedback
      ? {
          id: complaint.feedback._id || complaint.feedback.id,
          rating: complaint.feedback.rating,
          comment: complaint.feedback.comment,
          image: complaint.feedback.image,
          workCompleted: Boolean(complaint.feedback.workCompleted),
          percentDone: complaint.feedback.percentDone || 0,
          createdAt: complaint.feedback.createdAt,
          updatedAt: complaint.feedback.updatedAt,
        }
      : null,
    timeline: Array.isArray(complaint?.timeline)
      ? complaint.timeline.map((entry: any) => ({
          status: entry.status,
          timestamp: entry.timestamp || entry.time || new Date().toISOString(),
          note: entry.note,
        }))
      : [],
  };
};

export const complaintsApi = {
  async create(payload: ComplaintPayload) {
    const data = await apiClient.post("/api/complaints", payload);
    return normalizeComplaint(data);
  },
  async listMine() {
    const data = await apiClient.get("/api/complaints/my");
    return Array.isArray(data) ? data.map(normalizeComplaint) : [];
  },
  async getById(id: string) {
    const data = await apiClient.get(`/api/complaints/${id}`);
    return normalizeComplaint(data);
  },
  async listDepartment() {
    const data = await apiClient.get("/api/complaints/department");
    return Array.isArray(data) ? data.map(normalizeComplaint) : [];
  },
  async listAll() {
    const data = await apiClient.get("/api/complaints");
    return Array.isArray(data) ? data.map(normalizeComplaint) : [];
  },
  async updateStatus(id: string, status: string) {
    const data = await apiClient.put(`/api/complaints/${id}/status`, { status });
    return normalizeComplaint(data);
  },
  async assign(id: string, memberId: string) {
    const data = await apiClient.put(`/api/complaints/${id}/assign`, { memberId });
    return normalizeComplaint(data);
  },
};

export const feedbackApi = {
  submit(data: {
    complaintId: string;
    rating: number;
    comment?: string;
    image?: string;
    workCompleted: boolean;
    percentDone?: number;
  }) {
    return apiClient.post("/api/feedback", data);
  },
};

export const membersApi = {
  async list() {
    const data = await apiClient.get("/api/members");
    return Array.isArray(data)
      ? data.map((member: any) => ({
          id: member._id || member.id,
          _id: member._id,
          name: member.name,
          department: member.department,
        }))
      : [];
  },
  async create(name: string) {
    const data = await apiClient.post("/api/members", { name });
    return {
      id: data._id || data.id,
      _id: data._id,
      name: data.name,
      department: data.department,
    } as MemberRecord;
  },
};

export const notificationApi = {
  list() {
    return apiClient.get("/api/notifications");
  },
};
