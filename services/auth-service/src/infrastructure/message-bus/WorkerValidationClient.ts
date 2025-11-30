/**
 * this is when the inter communication bw auth - work sevices when the worker login time want to check the worker is valid or not 
 * so check from auth service is the worker is verified or not
 */

import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

interface WorkerLoginRequest {
    email: string;
    password: string;
    correlationId: string;
}

interface WorkerLoginResponse {
    success: boolean;
    data?: any;
    error?: string;
}

// export class WorkerValidationClient {
//     private readonly REQUEST_QUEUE = 'worker.validate.request';
//     private readonly RESPONSE_QUEUE = 'worker.validate.response';
//     private readonly TIMEOUT = 10000; 

//     constructor(private channel: Channel) {}

//     async validateWorker(email: string, password: string): Promise<WorkerLoginResponse> {
//         const correlationId = uuidv4();

//         await this.channel.assertQueue(this.REQUEST_QUEUE, { durable: true });
//         await this.channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

//         return new Promise((resolve, reject) => {
//             const timeout = setTimeout(() => {
//                 reject(new Error('Worker validation request timeout'));
//             }, this.TIMEOUT);

//             // Setup response consumer
//             this.channel.consume(
//                 this.RESPONSE_QUEUE,
//                 (msg) => {
//                     if (!msg) return;

//                     if (msg.properties.correlationId === correlationId) {
//                         clearTimeout(timeout);
//                         const response: WorkerLoginResponse = JSON.parse(msg.content.toString());
//                         this.channel.ack(msg);
//                         resolve(response);
//                     }
//                 },
//                 { noAck: false }
//             );

//             // Send request
//             const request: WorkerLoginRequest = {
//                 email,
//                 password,
//                 correlationId
//             };

//             this.channel.sendToQueue(
//                 this.REQUEST_QUEUE,
//                 Buffer.from(JSON.stringify(request)),
//                 {
//                     correlationId,
//                     persistent: true
//                 }
//             );

//             console.log('Sent worker validation request:', email);
//         });
//     }
// }

export class WorkerValidationClient {
    private readonly REQUEST_QUEUE = 'worker.validate.request';
    private readonly RESPONSE_QUEUE = 'worker.validate.response';
    private readonly TIMEOUT = 10000;

    private pendingRequests: Map<string, (res: WorkerLoginResponse) => void> = new Map();
    private initialized = false;

    constructor(private channel: Channel) {}

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        await this.channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

        this.channel.consume(
            this.RESPONSE_QUEUE,
            (msg) => {
                if (!msg) return;

                const correlationId = msg.properties.correlationId;
                const resolver = this.pendingRequests.get(correlationId);

                if (resolver) {
                    const response = JSON.parse(msg.content.toString());
                    resolver(response);

                    this.pendingRequests.delete(correlationId);
                    this.channel.ack(msg);
                }
            },
            { noAck: false }
        );
    }

    async validateWorker(email: string, password: string): Promise<WorkerLoginResponse> {
        await this.init();

        const correlationId = uuidv4();

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(correlationId);
                reject(new Error("Worker validation timeout"));
            }, this.TIMEOUT);

            this.pendingRequests.set(correlationId, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });

            const req = { email, password, correlationId };

            this.channel.sendToQueue(
                this.REQUEST_QUEUE,
                Buffer.from(JSON.stringify(req)),
                {
                    correlationId,
                    persistent: true
                }
            );
        });
    }
}
