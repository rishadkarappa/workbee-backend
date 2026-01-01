import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
  chatId: string;
  senderId: string;
  senderRole: 'user' | 'worker';
  content: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ['user', 'worker'], required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);