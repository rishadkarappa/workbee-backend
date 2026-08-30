import { IWorkProgressChangedEvent } from "./IWorkProgressChangedEvent";

export interface IWorkProgressEventPublisher {
    publishWorkProgressChanged(event:IWorkProgressChangedEvent):Promise<void>;
}