import { injectable } from "tsyringe";
import { ICloudinaryService } from "../../domain/services/ICloudinaryService";
import { ENV } from "../config/env";
import cloudinary from "../config/cloudinary.config";

@injectable()
export class CloudinaryService implements ICloudinaryService {

    generateUploadSignature(paramsToSign: Record<string, string | number>): { signature: string; timestamp: number; } {
        const timestamp = Math.round(Date.now() / 1000)
        const signature = cloudinary.utils.api_sign_request({...paramsToSign, timestamp}, ENV.CLOUDINARY_API_SECRET)
        return { signature, timestamp }
    }

    async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        })
    }
}
