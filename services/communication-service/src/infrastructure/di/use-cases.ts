import { container } from "tsyringe";

import { CreateChatUseCase } from "../../application/use-cases/chat/CreateChatUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";
import { GetUserChatsUseCase } from "../../application/use-cases/chat/GetUserChatsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";



container.registerSingleton("CreateChatUseCase",CreateChatUseCase)
container.registerSingleton("GetMessagesUseCase",GetMessagesUseCase)
container.registerSingleton("GetUserChatsUseCase",GetUserChatsUseCase)
container.registerSingleton("SendMessageUseCase",SendMessageUseCase)
