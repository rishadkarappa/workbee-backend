import { container } from "tsyringe";

import { WorkerEventConsumer } from "../message-bus/WorkerEventConsumer";

container.registerSingleton("WorkerEventConsumer", WorkerEventConsumer);
