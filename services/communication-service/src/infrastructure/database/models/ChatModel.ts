import mongoose, { Schema, Document } from 'mongoose';

export interface IChatDocument extends Document {
  participants: {
    userId: string;
    workerId: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
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
    lastMessageAt: { type: Date }
  },
  { timestamps: true }
);

// Create compound index for unique chat between user and worker
ChatSchema.index({ 'participants.userId': 1, 'participants.workerId': 1 }, { unique: true });

export const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);
