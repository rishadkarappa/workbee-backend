import { container } from "tsyringe";

//usecase
import { CreateChatUseCase } from "../../application/use-cases/chat/CreateChatUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";
import { GetUserChatsUseCase } from "../../application/use-cases/chat/GetUserChatsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { MarkChatAsReadUseCase } from "../../application/use-cases/chat/MarkChatAsReadUseCase";

import { SendBidOfferUseCase } from "../../application/use-cases/bid/SendBidOfferUseCase";
import { RespondToBidUseCase } from "../../application/use-cases/bid/RespondToBidUseCase";

//interface
import { ICreateChatUseCase } from "../../application/ports/chat/ICreateChatUseCase";
import { IGetMessagesUseCase } from "../../application/ports/chat/IGetMessagesUseCase";
import { IGetUserChatsUseCase } from "../../application/ports/chat/IGetUserChatsUseCase";
import { ISendMessageUseCase } from "../../application/ports/chat/ISendMessageUseCase";
import { IMarkChatAsReadUseCase } from "../../application/ports/chat/IMarkChatAsReadUseCase";
import { ISendBidOfferUseCase } from "../../application/ports/bid/ISendBidOfferUseCase";
import { IRespondToBidUseCase } from "../../application/ports/bid/IRespondToBidUseCase";

container.registerSingleton<ICreateChatUseCase>("CreateChatUseCase",CreateChatUseCase)
container.registerSingleton<IGetMessagesUseCase>("GetMessagesUseCase",GetMessagesUseCase)
container.registerSingleton<IGetUserChatsUseCase>("GetUserChatsUseCase",GetUserChatsUseCase)
container.registerSingleton<ISendMessageUseCase>("SendMessageUseCase",SendMessageUseCase)
container.registerSingleton<IMarkChatAsReadUseCase>("MarkChatAsReadUseCase", MarkChatAsReadUseCase); 
//bid
container.registerSingleton<ISendBidOfferUseCase>('SendBidOfferUseCase',SendBidOfferUseCase);
container.registerSingleton<IRespondToBidUseCase>('RespondToBidUseCase',RespondToBidUseCase);
