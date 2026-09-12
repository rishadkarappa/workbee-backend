import mongoose, { Document, Schema, Types } from "mongoose";
import { Address } from "../../../domain/entities/Address";

export enum WorkerStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface WorkerDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  bio?: string;
  address: Address;
  workTypes: string[];
  preferredWorks: string[];
  confirmations: {
    reliable: boolean;
    experienced: boolean;
    honest: boolean;
    termsAccepted: boolean;
  };
  workerProfileImage?: string;
  workerProfileImagePublicId?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
  blacklistReason: string;
  blacklistedAt: Date;
  status: WorkerStatus;
  rejectionReason?: string;
  rejectedAt?: Date;
  canReapply?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>({
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  panchayath: { type: String, required: true },
  city: { type: String, required: true },
  place: { type: String, required: true },
}, { _id: false });

const WorkerSchema = new Schema<WorkerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  workTypes: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: "At least one work type is required",
    },
  },
  bio: { type: String, required: false },
  preferredWorks: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: "At least one preferred work is required",
    },
  },
  confirmations: {
    reliable: { type: Boolean, required: true },
    experienced: { type: Boolean, required: true },
    honest: { type: Boolean, required: true },
    termsAccepted: { type: Boolean, required: true },
  },
  isBlocked: { type: Boolean, default: false },
  isBlacklisted: { type: Boolean, default: false },
  blacklistReason: { type: String, required: false },
  blacklistedAt: { type: Date, required: false },
  workerProfileImage: { type: String, required: false },
  workerProfileImagePublicId: { type: String, required: false },
  status: {
    type: String,
    enum: Object.values(WorkerStatus),
    default: WorkerStatus.PENDING
  },
  rejectionReason: { type: String },
  rejectedAt: { type: Date },
  canReapply: { type: Boolean, default: true }
}, { timestamps: true });

export const WorkerModel = mongoose.model<WorkerDocument>("Worker", WorkerSchema);