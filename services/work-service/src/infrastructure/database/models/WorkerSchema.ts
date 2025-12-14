import mongoose, { Document, Schema } from "mongoose";

export enum WorkerStatus {
  PENDING = "pending",
  APPROVED = "approved", 
  REJECTED = "rejected"
}

export interface WorkerDocument extends Document {
  name: string;
  email: string;
  phone: string;
  password:string;
  location: string;
  workType: string;
  preferredWorks: string[];
  confirmations: {
    reliable: boolean;
    honest: boolean;
    termsAccepted: boolean;
  };
  isBlocked:boolean;
  status:WorkerStatus;
  rejectionReason?: string; 
  rejectedAt?: Date; 
  canReapply?: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<WorkerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required:true},
  location: { type: String, required: true },
  workType: { type: String, required: true },
  preferredWorks: { type: [String], required: true },
  confirmations: {
    reliable: { type: Boolean, required: true },
    honest: { type: Boolean, required: true },
    termsAccepted: { type: Boolean, required: true },
  },
  isBlocked:{ type:Boolean, default:false},
  status:{
    type:String,
    enum:Object.values(WorkerStatus),
    default:WorkerStatus.PENDING
  },
  rejectionReason: { type: String },
  rejectedAt: { type: Date },
  canReapply: { type: Boolean, default: true }
}, { timestamps: true });

export const WorkerModel = mongoose.model<WorkerDocument>("Worker", WorkerSchema);
