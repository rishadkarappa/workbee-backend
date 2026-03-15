import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UploadController, uploadMiddleware } from '../controllers/Uploadcontroller';

const router = Router();
const uploadController = container.resolve(UploadController);

// Wrap multer so errors are forwarded to Express error handler
function handleMulterUpload(req: Request, res: Response, next: NextFunction) {
  uploadMiddleware(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}

// POST /upload/chat-media
router.post(
  '/upload/chat-media',
  handleMulterUpload,
  uploadController.uploadChatMedia.bind(uploadController)
);

export default router;