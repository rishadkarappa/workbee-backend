import { IWorkerBlockedEvent } from "../../infrastructure/message-bus/WorkerEventPublisher";

export interface IWorkerEventPublisher {
  publishWorkerBlocked(event: IWorkerBlockedEvent): Promise<void>;
}