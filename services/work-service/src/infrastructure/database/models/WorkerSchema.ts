import mongoose, { Document, Schema, Types } from "mongoose";

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
  isApproved: boolean;
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
  isApproved: { type:Boolean, default:false}
}, { timestamps: true });

export const WorkerModel = mongoose.model<WorkerDocument>("Worker", WorkerSchema);
