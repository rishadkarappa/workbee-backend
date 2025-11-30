import mongoose, { Document, Schema } from "mongoose";
import { Work } from "../../../domain/entities/Work";


export interface WorkTocument extends Omit<Work, 'id'>,Document{}

const WorkSchema = new Schema<WorkTocument>(
    {
        userId: { type: String, required: true, index: true },
        workTitle: { type: String, required: true },
        workCategory: { type: String, required: true },
        workType: { type: String, enum: ['oneDay', 'multipleDay'], required: true },
        date: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        time: { type: String, required: true },
        description: { type: String, required: true },
        voiceFile: { type: String },
        videoFile: { type: String },
        duration: { type: String },
        budget: { type: String },
        location: {
            type:{
                type:String,
                enum:["Point"],
                default:"Point",
                required: true
            },
            coordinates:{
                type:[Number],//longi , lati
                required: true
            }
        },
        currentLocation: { type: String },
        manualAddress: { type: String },
        landmark: { type: String },
        place: { type: String },
        contactNumber: { type: String, required: true },
        beforeImage: { type: String },
        petrolAllowance: { type: String },
        extraRequirements: { type: String },
        anythingElse: { type: String },
        termsAccepted: { type: Boolean, required: true, default: false },
        status: { 
            type: String, 
            enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], 
            default: 'pending' 
        }
    },
    { timestamps: true }
);

WorkSchema.index({ location: "2dsphere" });

export const WorkModel = mongoose.model<WorkTocument>("Work",WorkSchema);



