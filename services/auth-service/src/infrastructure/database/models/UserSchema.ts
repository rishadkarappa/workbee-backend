import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked:boolean;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required:false},
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum:["user","admin"],
      required: true,
      default: 'user'
    }
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<UserDocument>("User", UserSchema)