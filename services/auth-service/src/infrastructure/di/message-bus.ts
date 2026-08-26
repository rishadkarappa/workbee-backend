import { container } from "tsyringe";

import { WorkerEventConsumer } from "../message-bus/WorkerEventConsumer";
import { IWorkerValidationClient } from "../../application/ports/message-bus/IWorkerValidationClient";
import { WorkerValidationClient } from "../message-bus/WorkerLoginValidationClient";
import { IWorkerChangePasswordClient } from "../../application/ports/message-bus/IWorkerChangePasswordClient";
import { WorkerChangePasswordClient } from "../message-bus/WorkerChangePasswordClient";

container.registerSingleton("WorkerEventConsumer", WorkerEventConsumer);

container.registerSingleton<IWorkerValidationClient>("WorkerValidationClient",WorkerValidationClient);
container.registerSingleton<IWorkerChangePasswordClient>("WorkerChangePasswordClient",WorkerChangePasswordClient);


