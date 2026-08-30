import { injectable, inject } from "tsyringe";
import { ConsumeMessage } from "amqplib";
import { logger } from "../config/logger";

import { RabbitMQConnection } from "../config/rabbitmq";
import { SocketGateway } from "../socket/SocketGateway";

import { IWorkProgressChangedEvent } from "../../domain/message-contracts/IWorkProgressChangedEvent";
import { ICreateNotificationUseCase } from "../../application/ports/ICreateNotificationUseCase";


@injectable()
export class WorkProgressEventConsumer {
    private readonly EXCHANGE = "workbee.events";

    private readonly QUEUE = "notification.work_progress";
    private readonly ROUTING_KEY = "work.progress.changed";

    constructor(
        @inject("CreateNotificationUseCase") private readonly _createNotificationUseCase: ICreateNotificationUseCase,
        @inject("SocketManager") private readonly socketManager: SocketGateway
    ) { }

    async start(): Promise<void> {
        try {
            const channel = await RabbitMQConnection.getChannel();

            // exchange
            await channel.assertExchange(this.EXCHANGE, "topic", { durable: true, });

            // queue
            await channel.assertQueue(this.QUEUE, { durable: true, });

            // binding
            await channel.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);

            logger.info(`Waiting for work progress events in queue: ${this.QUEUE}`);

            channel.consume(this.QUEUE, async (msg: ConsumeMessage | null) => {
                if (!msg) return;

                try {
                    const event: IWorkProgressChangedEvent = JSON.parse(msg.content.toString());
                    await this.handleWorkProgressChanged(event);
                    channel.ack(msg);

                } catch (error) {
                    logger.error("Error processing work progress event:", error);
                    channel.nack(msg, false, false);
                }
            }, { noAck: false, });
        } catch (error) {
            logger.error("Failed to start work progress consumer:", error);
            throw error;
        }
    }

    private async handleWorkProgressChanged(event: IWorkProgressChangedEvent): Promise<void> {

        const notificationContent = this.getNotificationContent(event.progress);

        const notification = await this._createNotificationUseCase.execute({
            userId: event.userId,
            type: "WORK_UPDATE",
            title: notificationContent.title,
            message: notificationContent.message,
            data: {
                workId: event.workId,
                workerId: event.workerId,
                progress: event.progress,
            },
        });

        // real-time notification
        this.socketManager.emitNotificationToUser(event.userId, notification);

        logger.info(`Work progress notification sent to user ${event.userId}`);
    }

    private getNotificationContent(progress: IWorkProgressChangedEvent["progress"]): { title: string; message: string; } {
        switch (progress) {

            case "started":
                return {
                    title: "Work Has Been Started",
                    message: "The worker has started working on your work.",
                };

            case "ongoing":
                return {
                    title: "Work Is In Progress",
                    message: "The worker has updated your work status to in progress.",
                };

            case "completed":
                return {
                    title: "Work Completed",
                    message: "The worker has completed your work.",
                };

            default:
                throw new Error(`Unsupported work progress: ${progress}`);
        }
    }
}