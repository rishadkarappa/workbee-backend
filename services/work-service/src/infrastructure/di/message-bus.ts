import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/WorkerEventPublisher"
import { WorkerChangePasswordConsumer } from "../message-bus/WorkerChangePasswordConsumer";
import { WorkProgressEventPublisher } from "../message-bus/WorkProgressEventPublisher";
import { IWorkProgressEventPublisher } from "../../domain/message-bus/IWorkProgressEventPublisher";

/** publishers */
container.registerSingleton("WorkerEventPublisher", WorkerEventPublisher)
container.registerSingleton<IWorkProgressEventPublisher>("WorkProgressEventPublisher", WorkProgressEventPublisher)

/** consumers */
container.registerSingleton("WorkerChangePasswordConsumer", WorkerChangePasswordConsumer)