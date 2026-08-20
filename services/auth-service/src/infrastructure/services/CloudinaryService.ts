import { injectable } from "tsyringe";
import { ICloudinaryService } from "../../domain/services/ICloudinaryService";
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env";


@injectable()
export class CloudinaryService implements ICloudinaryService {
    constructor( ){
        cloudinary.config({
            cloud_name:ENV.CLOUDINARY_CLOUD_NAME,
            api_key:ENV.CLOUDINARY_API_KEY,
            api_secret:ENV.CLOUDINARY_API_SECRET
        }) 
    }

    generateUploadSignature(paramsToSign: Record<string, string | number>): { signature: string; timestamp: number; } {
        const timestamp = Math.round(Date.now() / 1000)
        const signature = cloudinary.utils.api_sign_request({...paramsToSign, timestamp}, ENV.CLOUDINARY_API_SECRET)
        return { signature, timestamp }
    }

    async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: ""
        })
    }
}