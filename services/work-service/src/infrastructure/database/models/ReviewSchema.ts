import mongoose, { Document, Schema, Types } from "mongoose";

export interface ReviewDocument extends Document {
    _id: Types.ObjectId;
    workId: string;
    workerId: string;
    userId: string;
    rating: number;
    testimonial?: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>({
    workId: { type: String, required: true, unique: true, index: true }, //one review per work thats y
    workerId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    testimonial: { type: String, maxlength: 500 },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ReviewModel = mongoose.model<ReviewDocument>("Review", ReviewSchema);