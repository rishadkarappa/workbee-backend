// import { Router } from 'express';
// import { container } from 'tsyringe';
// import { NotificationController } from '../controllers/NotificationController';

// const router = Router();
// const notificationController = container.resolve(NotificationController);

// router.get('/notifications', notificationController.getNotifications.bind(notificationController));
// router.get('/notifications/unread-count', notificationController.getUnreadCount.bind(notificationController));
// router.patch('/notifications/:notificationId/read', notificationController.markAsRead.bind(notificationController));
// router.patch('/notifications/mark-all-read', notificationController.markAllAsRead.bind(notificationController));

// export default router;

// presentation/routes/notificationRoutes.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();
const notificationController = container.resolve(NotificationController);

router.get('/notifications', notificationController.getNotifications.bind(notificationController));
router.get('/notifications/unread-count', notificationController.getUnreadCount.bind(notificationController));

// ✅ CRITICAL: literal route MUST be before the parameterized route.
// If /:notificationId/read comes first, Express matches "mark-all-read"
// as the notificationId param → calls markAsRead("mark-all-read") → fails silently.
router.patch('/notifications/mark-all-read', notificationController.markAllAsRead.bind(notificationController));
router.patch('/notifications/:notificationId/read', notificationController.markAsRead.bind(notificationController));

export default router;