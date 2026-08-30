import { Channel } from "amqplib";

export interface IWorkerChangePasswordConsumer {
    start(channel: Channel): Promise<void>;
}