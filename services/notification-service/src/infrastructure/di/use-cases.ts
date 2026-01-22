import { container } from "tsyringe";

import { CreateNotificationUseCase } from "../../application/use-cases/CreateNotificationUseCase";
import { GetUnreadCountUseCase } from "../../application/use-cases/GetUnreadCountUseCase";
import { GetUserNotificationsUseCase } from "../../application/use-cases/GetUserNotificationsUseCase";
import { MarkAllAsReadUseCase } from "../../application/use-cases/MarkAllAsReadUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/MarkNotificationAsReadUseCase";


container.registerSingleton("CreateNotificationUseCase", CreateNotificationUseCase);
container.registerSingleton("GetUserNotificationsUseCase", GetUserNotificationsUseCase);
container.registerSingleton("MarkNotificationAsReadUseCase", MarkNotificationAsReadUseCase);
container.registerSingleton("MarkAllAsReadUseCase", MarkAllAsReadUseCase);
container.registerSingleton("GetUnreadCountUseCase", GetUnreadCountUseCase);