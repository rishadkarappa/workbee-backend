import { v2 as cloudinary } from 'cloudinary';
import { injectable } from 'tsyringe';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  duration?: number; // for video
  bytes: number;
}

@injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload a file buffer to Cloudinary
   * @param buffer  - raw file buffer
   * @param folder  - cloudinary folder (e.g. 'chat/images')
   * @param resourceType - 'image' | 'video'
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'video'
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          // For videos, limit to 50 MB; images 10 MB
          chunk_size: 6_000_000,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            url:          result.secure_url,
            publicId:     result.public_id,
            resourceType: resourceType,
            format:       result.format,
            width:        result.width,
            height:       result.height,
            duration:     (result as any).duration,
            bytes:        result.bytes,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  /**
   * Delete a file from Cloudinary by its publicId
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}