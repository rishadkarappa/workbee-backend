import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/WorkerEventPublisher"
import { WorkerChangePasswordConsumer } from "../message-bus/WorkerChangePasswordConsumer";

container.registerSingleton("WorkerEventPublisher", WorkerEventPublisher)

container.registerSingleton("WorkerChangePasswordConsumer", WorkerChangePasswordConsumer)