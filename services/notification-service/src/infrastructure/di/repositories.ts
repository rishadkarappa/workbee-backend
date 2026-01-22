import 'reflect-metadata';
import { container } from 'tsyringe';
import { NotificationRepository } from '../database/repositories/NotificationRepository';
import { MessageEventConsumer } from '../message-bus/MessageEventConsumer';

// Register repositories
container.registerSingleton("NotificationRepository", NotificationRepository);

// Register messaging
container.registerSingleton(MessageEventConsumer);

export { container };