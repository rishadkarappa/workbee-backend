import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/publishers/WorkerEventPublisher";

container.registerSingleton("WorkerEventPublisher", WorkerEventPublisher)