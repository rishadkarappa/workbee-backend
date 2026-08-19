import { v2 as cloudinary } from 'cloudinary';
import { injectable } from 'tsyringe';
import { ICloudinaryService, ICloudinaryUploadResult } from '../../domain/services/ICloudeService';

@injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload a file buffer to Cloudinary
   * @param buffer  - raw file buffer
   * @param folder  - cloudinary folder (e.g. 'chat/images')
   * @param resourceType - 'image' | 'video'
   */

  /**
  * Sign a set of upload params so the client can upload directly to Cloudinary.
  */

  generateUploadSignature(paramsToSign: Record<string, string | number>): { signature: string; timestamp: number; } {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request({ ...paramsToSign, timestamp },
      process.env.CLOUDINARY_API_SECRET as string
    );
    return { signature, timestamp };
  }

  /**
   * Delete a file from Cloudinary by its publicId
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }


}

