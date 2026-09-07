import mongoose, { Document, Schema, Types } from "mongoose";
import { ComplaintType, DisputeActionType, DisputeStatus } from "../../../domain/entities/Dispute";

export interface DisputeActionSub {
  actionType: DisputeActionType;
  reason: string;
  takenBy: string;
  takenAt: Date;
}

export interface DisputeDocument extends Document {
  _id: Types.ObjectId;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  complaintType: ComplaintType;
  description: string;
  proofImages: string[];
  proofVideo?: string;
  status: DisputeStatus;
  actions: DisputeActionSub[];
  createdAt: Date;
  updatedAt: Date;
}

const DisputeActionSchema = new Schema<DisputeActionSub>(
  {
    actionType: {
      type: String,
      enum: [
        "block_worker", "unblock_worker",
        "block_user", "unblock_user",
        "blacklist_worker", "unblacklist_worker",
        "blacklist_user", "unblacklist_user",
        "warning_email_worker", "warning_email_user",
        "no_action",
      ],
      required: true,
    },
    reason: { type: String, required: true },
    takenBy: { type: String, required: true },
    takenAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DisputeSchema = new Schema<DisputeDocument>(
  {
    workId: { type: String, required: true, index: true },
    workTitle: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    workerId: { type: String, required: true, index: true },
    complaintType: {
      type: String,
      enum: ["against_worker", "about_work", "cleanliness", "behavior", "work_not_completed", "fraud_suspicion", "other"],
      required: true,
    },
    description: { type: String, required: true, maxlength: 1000 },
    proofImages: {
      type: [String],
      default: [],
      validate: [(v: string[]) => v.length <= 2, "Max 2 images allowed"],
    },
    proofVideo: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "dismissed"],
      default: "pending",
    },
    actions: { type: [DisputeActionSchema], default: [] },
  },
  { timestamps: true }
);

export const DisputeModel = mongoose.model<DisputeDocument>("Dispute", DisputeSchema);