import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified:boolean;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: {type:Boolean, default:false}
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<UserDocument>("User",UserSchema)