import mongoose, { Schema } from "mongoose";


const DisputeShema = new Schema({
    userId:{
        type:String,
        required:true,
    },
    workerId:{
        type:String,
        required:true
    },
    complaintAgainstWorker:{
        type:String,
        required:false
    },
    proofImg1:{
        type:String,
        requried:false
    },
    proofImg2:{
        type:String,
        requried:false
    },
    proofVed:{
        type:String,
        requried:false
    }
})

export const DisputeModal = mongoose.model("Dispute",DisputeShema)