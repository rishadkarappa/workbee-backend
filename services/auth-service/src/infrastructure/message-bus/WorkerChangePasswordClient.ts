import { Channel } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger/logger";
import { ChangeWorkerPasswordResponseRMQDTO } from "../../application/dtos/worker/RMQ/ChangeWorkerPasswordRMQDTO";

export class WorkerPasswordClient {

    private readonly REQUEST_QUEUE = "worker.change-password.request";
    private readonly RESPONSE_QUEUE = "worker.change-password.response";

    private readonly TIMEOUT = 10000;

    constructor(private readonly channel: Channel) { }

    async changePassword(workerId: string, currentPassword: string, newPassword: string): Promise<ChangeWorkerPasswordResponseRMQDTO> {

        const correlationId = uuidv4();

        return new Promise(async (resolve, reject) => {

            let consumerTag: string | null = null;
            let isResolved = false;

            const timeoutId = setTimeout(() => {

                if (!isResolved) {

                    isResolved = true;

                    logger.error(`Worker password change timeout: ${correlationId}`);

                    if (consumerTag) {
                        this.channel
                            .cancel(consumerTag)
                            .catch(err =>
                                logger.error("Error canceling consumer:", err)
                            );
                    }

                    reject(
                        new Error("Worker password change request timed out.")
                    );
                }

            }, this.TIMEOUT);

            try {

                await this.channel.assertQueue(
                    this.REQUEST_QUEUE,
                    { durable: true }
                );

                await this.channel.assertQueue(
                    this.RESPONSE_QUEUE,
                    { durable: true }
                );

                const consumer = await this.channel.consume(this.RESPONSE_QUEUE, (msg) => {

                    if (!msg || isResolved) {
                        return;
                    }

                    if (msg.properties.correlationId !== correlationId) {
                        return;
                    }

                    isResolved = true;

                    clearTimeout(timeoutId);

                    try {

                        const response = JSON.parse(msg.content.toString());

                        this.channel.ack(msg);

                        this.channel
                            .cancel(consumer.consumerTag)
                            .catch(err =>
                                logger.error("Error canceling consumer:", err)
                            );

                        resolve(response);

                    } catch (error) {

                        this.channel.ack(msg);

                        reject(new Error("Invalid password response."));
                    }
                },
                    {
                        noAck: false
                    }
                );

                consumerTag = consumer.consumerTag;

                const request = {
                    workerId,
                    currentPassword,
                    newPassword,
                    correlationId
                };

                this.channel.sendToQueue(
                    this.REQUEST_QUEUE,
                    Buffer.from(
                        JSON.stringify(request)
                    ),
                    {
                        correlationId,
                        persistent: true
                    }
                );

                logger.info(`Worker password change request sent: ${correlationId}`);

            } catch (error) {
                isResolved = true;
                clearTimeout(timeoutId);

                if (consumerTag) {
                    await this.channel
                        .cancel(consumerTag)
                        .catch(() => { });
                }
                reject(error);
            }
        });
    }
}