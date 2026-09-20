import { validationResult } from "express-validator";
import { Feedback } from "../models/Feedback.js";
import { Complaint } from "../models/Complaint.js";

export const submitFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { complaintId, rating, comment, image, workCompleted, percentDone } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Cannot submit feedback for this complaint" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({ message: "Feedback allowed only when resolved" });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { complaintId },
      {
        complaintId,
        userId: req.user._id,
        rating,
        comment: comment || "",
        image,
        workCompleted,
        percentDone: percentDone || 0,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    complaint.feedback = feedback._id;
    await complaint.save();

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit feedback", error: error.message });
  }
};
