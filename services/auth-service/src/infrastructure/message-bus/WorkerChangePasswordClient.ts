import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger/logger";
import { ChangeWorkerPasswordResponseRMQDTO } from "../../application/dtos/worker/RMQ/ChangeWorkerPasswordRMQDTO";
import { IWorkerChangePasswordClient } from "../../application/ports/message-bus/IWorkerChangePasswordClient";
import { injectable } from "tsyringe";
import { RabbitMQConnection } from "../config/rabbitmq";

/**
 * inter service communication
 * - worker change password time want to check the password is corruct or no in work service
 */

@injectable()
export class WorkerChangePasswordClient implements IWorkerChangePasswordClient {

    private readonly REQUEST_QUEUE = "worker.change-password.request";
    private readonly RESPONSE_QUEUE = "worker.change-password.response";

    private readonly TIMEOUT = 10000;

    async changePassword(workerId: string, currentPassword: string, newPassword: string): Promise<ChangeWorkerPasswordResponseRMQDTO> {

        const channel = await RabbitMQConnection.getChannel();

        const correlationId = uuidv4();

        return new Promise(async (resolve, reject) => {

            let consumerTag: string | null = null;
            let isResolved = false;

            const timeoutId = setTimeout(() => {

                if (!isResolved) {
                    isResolved = true;
                    logger.error(`Worker password change timeout: ${correlationId}`);

                    if (consumerTag) {
                        channel.cancel(consumerTag).catch(err =>
                            logger.error("Error canceling consumer:", err)
                        );
                    }

                    reject(new Error("Worker password change request timed out."));
                }

            }, this.TIMEOUT);

            try {

                await channel.assertQueue(this.REQUEST_QUEUE, { durable: true });
                await channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

                const consumer = await channel.consume(this.RESPONSE_QUEUE, (msg) => {

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
                        channel.ack(msg);

                        channel
                            .cancel(consumer.consumerTag)
                            .catch(err => logger.error("Error canceling consumer:", err));

                        resolve(response);

                    } catch (error) {
                        channel.ack(msg);
                        reject(new Error("Invalid password response."));
                        logger.error(error)
                    }
                }, { noAck: false });

                consumerTag = consumer.consumerTag;

                const request = { workerId, currentPassword, newPassword, correlationId };

                channel.sendToQueue(this.REQUEST_QUEUE, Buffer.from(JSON.stringify(request)), {
                    correlationId,
                    persistent: true
                });

                logger.info(`Worker password change request sent: ${correlationId}`);

            } catch (error) {
                isResolved = true;
                clearTimeout(timeoutId);

                if (consumerTag) {
                    await channel.cancel(consumerTag)
                        .catch(() => { });
                }
                reject(error);
            }
        });
    }
}