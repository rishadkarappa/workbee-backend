import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import multer from 'multer';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';

// ─── Multer config: memory storage (no disk writes) 
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if ([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE }, // use the larger limit; per-type check is below
}).single('file');

@injectable()
export class UploadController {
  constructor(
    @inject('CloudinaryService') private cloudinaryService: CloudinaryService
  ) {}

  async uploadChatMedia(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseHelper.error('No file provided', HttpStatus.BAD_REQUEST)
        );
      }

      const { mimetype, buffer, size } = req.file;
      const isImage = ALLOWED_IMAGE_TYPES.includes(mimetype);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(mimetype);

      if (!isImage && !isVideo) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseHelper.error('Unsupported file type', HttpStatus.BAD_REQUEST)
        );
      }

      // Enforce per-type size limits
      if (isImage && size > MAX_IMAGE_SIZE) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseHelper.error('Image must be under 10 MB', HttpStatus.BAD_REQUEST)
        );
      }
      if (isVideo && size > MAX_VIDEO_SIZE) {
        return res.status(HttpStatus.BAD_REQUEST).json(
          ResponseHelper.error('Video must be under 50 MB', HttpStatus.BAD_REQUEST)
        );
      }

      const resourceType = isImage ? 'image' : 'video';
      const folder = isImage ? 'chat/images' : 'chat/videos';

      const result = await this.cloudinaryService.uploadBuffer(buffer, folder, resourceType);

      return res.status(HttpStatus.OK).json(
        ResponseHelper.success(result, 'File uploaded successfully')
      );
    } catch (error: any) {
      console.error('[UploadController] uploadChatMedia error:', error);
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(error.message, HttpStatus.BAD_REQUEST)
      );
    }
  }
}