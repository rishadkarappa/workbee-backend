/**
 * this is the inter communicaiton bw work sevice - auth service 
 * bec : when the post work time want to save the user id into worker db so want fetch user id and want to check the user is valid or not
 */

import { Channel } from 'amqplib';
import { injectable } from 'tsyringe';

interface UserValidationRequest {
    userId: string;
    correlationId: string;
}

interface UserValidationResponse {
    success: boolean;
    data?: any;
    error?: string;
}

@injectable()
export class UserValidationConsumer {
    private readonly QUEUE_NAME = 'user.validate.request';
    private readonly RESPONSE_QUEUE = 'user.validate.response';

    constructor() {}

    async start(channel: Channel): Promise<void> {
        await channel.assertQueue(this.QUEUE_NAME, { durable: true });
        await channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

        console.log(` Listening for user validation requests on ${this.QUEUE_NAME}`);

        channel.consume(this.QUEUE_NAME, async (msg) => {
            if (!msg) return;

            try {
                const request: UserValidationRequest = JSON.parse(msg.content.toString());
                console.log('Received user validation request:', request.userId);

                // For work service, we just acknowledge the request came from auth service
                const response: UserValidationResponse = {
                    success: true,
                    data: { validated: true }
                };

                channel.sendToQueue(
                    this.RESPONSE_QUEUE,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: request.correlationId,
                        persistent: true
                    }
                );

                channel.ack(msg);
                console.log('-- User validation response sent');
            } catch (error: any) {
                console.error('-- Error processing user validation:', error);
                
                const errorResponse: UserValidationResponse = {
                    success: false,
                    error: error.message
                };

                const request: UserValidationRequest = JSON.parse(msg.content.toString());
                channel.sendToQueue(
                    this.RESPONSE_QUEUE,
                    Buffer.from(JSON.stringify(errorResponse)),
                    {
                        correlationId: request.correlationId,
                        persistent: true
                    }
                );

                channel.ack(msg);
            }
        });
    }
}