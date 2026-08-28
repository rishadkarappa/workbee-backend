import { UserRole } from "workbee-common";
import mongoose, { Document, Schema } from "mongoose";

// export interface UserDocument extends Document {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   phone:string;
//   password: string;
//   isVerified: boolean;
//   isBlocked: boolean;
//   role: UserRole;
//   userProfileImage: string,
//   userProfileImagePublicId: string,
//   createdAt: Date;
// }

// const UserSchema = new Schema<UserDocument>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: {type:String, required: true, unique: true },
//     password: { type: String, required: false },
//     isVerified: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     role: {
//       type: String,
//       enum: UserRole,
//       required: true,
//       default: UserRole.USER
//     },
//     userProfileImage: {
//       type: String,
//       required: false
//     },

//     userProfileImagePublicId: {
//       type: String,
//       required: false
//     }
//   },
//   { timestamps: true }
// )

// export const UserModel = mongoose.model<UserDocument>("User", UserSchema)

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  location?: string;
  bio?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: UserRole;
  userProfileImage?: string;
  userProfileImagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },

    location: {
      type: String,
      required: false,
      trim: true,
    },

    bio: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: UserRole,
      required: true,
      default: UserRole.USER,
    },

    userProfileImage: {
      type: String,
      required: false,
    },

    userProfileImagePublicId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>("User",UserSchema);