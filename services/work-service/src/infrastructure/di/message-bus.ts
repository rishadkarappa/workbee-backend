import { container } from "tsyringe";

import { WorkerEventPublisher } from "../message-bus/WorkerEventPublisher";

container.registerSingleton("WorkerEventPublisher", WorkerEventPublisher)