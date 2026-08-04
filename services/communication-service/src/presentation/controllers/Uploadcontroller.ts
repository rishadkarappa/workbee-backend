import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { HttpStatus } from '../../shared/enums/HttpStatus';
import { ResponseHelper } from '../../shared/helpers/responseHelper';
import { getErrorMessage } from 'workbee-common';

@injectable()
export class UploadController {
  constructor(
    @inject('CloudinaryService') private cloudinaryService: CloudinaryService
  ) { }

  async getUploadSignature(req: Request, res: Response) {
    try {
      const resourceType = req.query.resourceType === 'video' ? 'video' : 'image';
      const folder = resourceType === 'video' ? 'chat/videos' : 'chat/images';

      const { signature, timestamp } = this.cloudinaryService.generateUploadSignature({ folder });

      return res.status(HttpStatus.OK).json(
        ResponseHelper.success(
          {
            signature,
            timestamp,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            folder,
            resourceType,
          }, 'Signature generated'));
    } catch (error) {
      console.error('UploadController - getUploadSignature error:', error);
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(getErrorMessage(error), HttpStatus.BAD_REQUEST)
      );
    }
  }
}