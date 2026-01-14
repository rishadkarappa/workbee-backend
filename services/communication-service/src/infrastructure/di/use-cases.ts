import { container } from "tsyringe";

import { CreateChatUseCase } from "../../application/use-cases/chat/CreateChatUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";
import { GetUserChatsUseCase } from "../../application/use-cases/chat/GetUserChatsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { ICreateChatUseCase } from "../../application/ports/chat/ICreateChatUseCase";
import { IGetMessagesUseCase } from "../../application/ports/chat/IGetMessagesUseCase";
import { IGetUserChatsUseCase } from "../../application/ports/chat/IGetUserChatsUseCase";
import { ISendMessageUseCase } from "../../application/ports/chat/ISendMessageUseCase";



container.registerSingleton<ICreateChatUseCase>("CreateChatUseCase",CreateChatUseCase)
container.registerSingleton<IGetMessagesUseCase>("GetMessagesUseCase",GetMessagesUseCase)
container.registerSingleton<IGetUserChatsUseCase>("GetUserChatsUseCase",GetUserChatsUseCase)
container.registerSingleton<ISendMessageUseCase>("SendMessageUseCase",SendMessageUseCase)
