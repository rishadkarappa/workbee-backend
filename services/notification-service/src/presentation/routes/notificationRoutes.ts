import { Router } from 'express';
import { container } from 'tsyringe';
import { NotificationController } from '../controllers/NotificationController';
// import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const notificationController = container.resolve(NotificationController);

// Protected routes - require authentication

router.get('/notifications', notificationController.getNotifications.bind(notificationController));
router.get('/notifications/unread-count', notificationController.getUnreadCount.bind(notificationController));
router.patch('/notifications/:notificationId/read', notificationController.markAsRead.bind(notificationController));
router.patch('/notifications/mark-all-read', notificationController.markAllAsRead.bind(notificationController));

export default router;