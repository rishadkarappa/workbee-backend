// /**
//  * this is when the inter communication bw auth - work sevices when the worker login time want to check the worker is valid or not 
//  * so check from auth service is the worker is verified or not
//  */

import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

interface WorkerLoginResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export class WorkerValidationClient {
    private readonly REQUEST_QUEUE = 'worker.validate.request';
    private readonly RESPONSE_QUEUE = 'worker.validate.response';
    private readonly TIMEOUT = 10000; // 10 seconds

    constructor(private channel: Channel) {}

    async validateWorker(email: string, password: string): Promise<WorkerLoginResponse> {
        const correlationId = uuidv4();

        return new Promise(async (resolve, reject) => {
            let consumerTag: string | null = null;
            let isResolved = false;

            // Timeout handler
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    console.error(`Timeout for correlation: ${correlationId}`);
                    
                    // Cancel consumer on timeout
                    if (consumerTag) {
                        this.channel.cancel(consumerTag).catch(err => 
                            console.error("Error canceling consumer:", err)
                        );
                    }
                    
                    reject(new Error("Worker validation timeout. Please try again."));
                }
            }, this.TIMEOUT);

            try {
                // Assert queues
                await this.channel.assertQueue(this.REQUEST_QUEUE, { durable: true });
                await this.channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

                // Create a NEW consumer for THIS request only
                const consumer = await this.channel.consume(
                    this.RESPONSE_QUEUE,
                    (msg) => {
                        if (!msg || isResolved) return;

                        // Only process matching correlationId
                        if (msg.properties.correlationId === correlationId) {
                            isResolved = true;
                            clearTimeout(timeoutId);

                            try {
                                const response = JSON.parse(msg.content.toString());
                                
                                console.log(`Received response for: ${correlationId}`, {
                                    success: response.success
                                });

                                // Acknowledge message
                                this.channel.ack(msg);

                                // Cancel this consumer immediately
                                this.channel.cancel(consumer.consumerTag).catch(err =>
                                    console.error("Error canceling consumer:", err)
                                );

                                resolve(response);
                            } catch (parseError) {
                                console.error("Error parsing response:", parseError);
                                this.channel.ack(msg);
                                reject(new Error("Invalid response format"));
                            }
                        } else {
                            // Acknowledge but ignore mismatched messages
                            console.warn(`Ignoring message with wrong correlationId: ${msg.properties.correlationId}`);
                            this.channel.ack(msg);
                        }
                    },
                    { noAck: false }
                );

                consumerTag = consumer.consumerTag;

                //  Send request after consumer is set up
                this.channel.sendToQueue(
                    this.REQUEST_QUEUE,
                    Buffer.from(JSON.stringify({ email, password, correlationId })),
                    {
                        correlationId: correlationId,
                        persistent: true
                    }
                );

                console.log(`Sent validation request: ${correlationId}`);

            } catch (error) {
                isResolved = true;
                clearTimeout(timeoutId);
                console.error("RabbitMQ error:", error);
                
                if (consumerTag) {
                    this.channel.cancel(consumerTag).catch(err =>
                        console.error("Error canceling consumer:", err)
                    );
                }
                
                reject(error);
            }
        });
    }
}
