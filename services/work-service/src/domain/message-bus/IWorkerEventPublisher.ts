import { IWorkerBlockedEvent } from "../../infrastructure/message-bus/types/types";

export interface IWorkerEventPublisher {
  publishWorkerBlocked(event: IWorkerBlockedEvent): Promise<void>;
}