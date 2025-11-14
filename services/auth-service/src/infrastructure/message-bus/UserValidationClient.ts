/**
 * this is the inter communicaiton bw work sevice - auth service 
 * bec : when the post work time want to save the user id into worker db so want fetch user id and want to check the user is valid or not
 */

import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

interface UserValidationRequest {
    userId: string;
    correlationId: string;
}

interface UserValidationResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export class UserValidationClient {
    private readonly REQUEST_QUEUE = 'user.validate.request';
    private readonly RESPONSE_QUEUE = 'user.validate.response';
    private readonly TIMEOUT = 10000;

    constructor(private channel: Channel) {}

    async validateUser(userId: string): Promise<UserValidationResponse> {
        const correlationId = uuidv4();

        await this.channel.assertQueue(this.REQUEST_QUEUE, { durable: true });
        await this.channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('User validation request timeout'));
            }, this.TIMEOUT);

            this.channel.consume(
                this.RESPONSE_QUEUE,
                (msg) => {
                    if (!msg) return;

                    if (msg.properties.correlationId === correlationId) {
                        clearTimeout(timeout);
                        const response: UserValidationResponse = JSON.parse(msg.content.toString());
                        this.channel.ack(msg);
                        resolve(response);
                    }
                },
                { noAck: false }
            );

            const request: UserValidationRequest = {
                userId,
                correlationId
            };

            this.channel.sendToQueue(
                this.REQUEST_QUEUE,
                Buffer.from(JSON.stringify(request)),
                {
                    correlationId,
                    persistent: true
                }
            );

            console.log('Sent user validation request:', userId);
        });
    }
}