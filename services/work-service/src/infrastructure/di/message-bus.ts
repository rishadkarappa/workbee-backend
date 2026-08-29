import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/WorkerEventPublisher"
import { WorkerChangePasswordConsumer } from "../message-bus/WorkerChangePasswordConsumer";
import { WorkProgressEventPublisher } from "../message-bus/WorkProgressEventPublisher";

/** publishers */
container.registerSingleton("WorkerEventPublisher", WorkerEventPublisher)
container.registerSingleton("WorkProgressEventPublisher", WorkProgressEventPublisher)

/** consumers */
container.registerSingleton("WorkerChangePasswordConsumer", WorkerChangePasswordConsumer)