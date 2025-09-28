import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<UserDocument>("User",UserSchema)