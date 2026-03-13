import mongoose, { Schema, Document } from 'mongoose';

export interface IChatDocument extends Document {
  participants: {
    userId: string;
    workerId: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: {
    userId: number;
    workerId: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChatDocument>(
  {
    participants: {
      userId: { type: String, required: true },
      workerId: { type: String, required: true }
    },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    unreadCount: {
      userId:   { type: Number, default: 0 },
      workerId: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

ChatSchema.index(
  { 'participants.userId': 1, 'participants.workerId': 1 },
  { unique: true }
);

export const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);