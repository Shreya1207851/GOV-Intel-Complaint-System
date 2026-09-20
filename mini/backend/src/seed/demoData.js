import { User } from "../models/User.js";
import { Member } from "../models/Member.js";
import { Complaint } from "../models/Complaint.js";
import { Feedback } from "../models/Feedback.js";

const DEMO_USERS = [
  { name: "Aarav Sharma", email: "citizen@demo.com", password: "demo123", role: "citizen", status: "active" },
  { name: "Vikram Patel", email: "admin@demo.com", password: "demo123", role: "admin", status: "active" },
  { name: "Priya Nair", email: "authority@demo.com", password: "demo123", role: "department", department: "Road & Infrastructure", status: "active" },
  { name: "Rajesh Kumar", email: "road@demo.com", password: "demo123", role: "department", department: "Road & Infrastructure", status: "active" },
  { name: "Meera Singh", email: "water@demo.com", password: "demo123", role: "department", department: "Water Supply", status: "active" },
  { name: "Amit Verma", email: "electricity@demo.com", password: "demo123", role: "department", department: "Electricity", status: "active" },
  { name: "Neha Patel", email: "environment@demo.com", password: "demo123", role: "department", department: "Environment", status: "active" },
];

const DEMO_MEMBERS = [
  { name: "Officer Priya", department: "Road & Infrastructure" },
  { name: "Officer Rajesh", department: "Water Supply" },
  { name: "Officer Amit", department: "Electricity" },
  { name: "Officer Neha", department: "Environment" },
];

const complaintSeeds = (citizenId, membersByDepartment) => [
  {
    title: "Pothole on MG Road near Junction 5",
    description: "Large pothole causing traffic disruption and safety issues.",
    category: "Road & Infrastructure",
    location: "MG Road, Junction 5",
    status: "Assigned",
    assignedTo: membersByDepartment["Road & Infrastructure"]?._id || null,
    createdBy: citizenId,
    timeline: [
      { status: "Pending", timestamp: new Date() },
      { status: "Assigned", timestamp: new Date(), note: "Assigned to field officer" },
    ],
  },
  {
    title: "Water supply disruption in Sector 7",
    description: "No water supply for the last two days in the neighborhood.",
    category: "Water Supply",
    location: "Sector 7, Block C",
    status: "In Progress",
    assignedTo: membersByDepartment["Water Supply"]?._id || null,
    createdBy: citizenId,
    timeline: [
      { status: "Pending", timestamp: new Date() },
      { status: "Assigned", timestamp: new Date() },
      { status: "In Progress", timestamp: new Date(), note: "Repair team dispatched" },
    ],
  },
  {
    title: "Streetlights not working on Park Avenue",
    description: "Five streetlights are not functioning after sunset.",
    category: "Electricity",
    location: "Park Avenue",
    status: "Pending",
    assignedTo: null,
    createdBy: citizenId,
    timeline: [{ status: "Pending", timestamp: new Date() }],
  },
  {
    title: "Garbage not collected for a week",
    description: "Waste collection has been missed and garbage is piling up.",
    category: "Environment",
    location: "Rose Garden Colony",
    status: "Resolved",
    assignedTo: membersByDepartment.Environment?._id || null,
    createdBy: citizenId,
    timeline: [
      { status: "Pending", timestamp: new Date() },
      { status: "Assigned", timestamp: new Date() },
      { status: "In Progress", timestamp: new Date() },
      { status: "Resolved", timestamp: new Date(), note: "Cleanup completed" },
    ],
  },
];

export const seedDemoData = async () => {
  if (process.env.SEED_DEMO_DATA === "false") {
    return;
  }

  for (const userData of DEMO_USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      await User.create(userData);
    }
  }

  const adminUser = await User.findOne({ email: "admin@demo.com" });

  for (const memberData of DEMO_MEMBERS) {
    const existing = await Member.findOne({ name: memberData.name, department: memberData.department });
    if (!existing) {
      await Member.create({ ...memberData, createdBy: adminUser?._id || null });
    }
  }

  const existingComplaints = await Complaint.countDocuments();
  if (existingComplaints > 0) {
    return;
  }

  const citizen = await User.findOne({ email: "citizen@demo.com" });
  if (!citizen) {
    return;
  }

  const members = await Member.find({});
  const membersByDepartment = members.reduce((acc, member) => {
    acc[member.department] = member;
    return acc;
  }, {});

  const createdComplaints = await Complaint.insertMany(complaintSeeds(citizen._id, membersByDepartment));

  const resolvedComplaint = createdComplaints.find((complaint) => complaint.status === "Resolved");
  if (!resolvedComplaint) {
    return;
  }

  const feedback = await Feedback.create({
    complaintId: resolvedComplaint._id,
    userId: citizen._id,
    rating: 4,
    comment: "The issue was resolved well, but cleanup could be slightly better.",
    workCompleted: true,
    percentDone: 90,
  });

  resolvedComplaint.feedback = feedback._id;
  await resolvedComplaint.save();
};
