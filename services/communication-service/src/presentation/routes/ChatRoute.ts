import { Router } from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../controllers/ChatController';

const router = Router();
const chatController = container.resolve(ChatController);

router.post('/chat/create',chatController.createChat.bind(chatController));
router.get('/chat/my-chats', chatController.getUserChats.bind(chatController));
router.get('/chat/:chatId/messages', chatController.getMessages.bind(chatController));

export default router;