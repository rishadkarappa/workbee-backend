/**
 * this is when the inter communication bw auth - work sevices when the worker login time want to check the worker details like password, and valid or not 
 * so check from auth service is the worker is verified or not
 */

import { Channel } from 'amqplib';
import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../domain/repositories/IWorkerRepository';
import { IHashService } from '../../domain/services/IHashService';

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

@injectable()
export class WorkerValidationConsumer {
    private readonly QUEUE_NAME = 'worker.validate.request';
    private readonly RESPONSE_QUEUE = 'worker.validate.response';

    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository,
        @inject("HashService") private hashService: IHashService
    ) {}

    async start(channel: Channel): Promise<void> {
        await channel.assertQueue(this.QUEUE_NAME, { durable: true });
        await channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

        console.log(`Listening for worker validation requests on ${this.QUEUE_NAME}`);

        channel.consume(this.QUEUE_NAME, async (msg) => {
            if (!msg) return;

            try {
                const request: WorkerLoginRequest = JSON.parse(msg.content.toString());
                console.log(' Received worker validation request:', request.email);

                const response = await this.validateWorker(request);

                // Send response back
                channel.sendToQueue(
                    this.RESPONSE_QUEUE,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: request.correlationId,
                        persistent: true
                    }
                );

                channel.ack(msg);
                console.log('-- Worker validation response sent');
            } catch (error: any) {
                console.error('Error processing worker validation:', error);
                
                const errorResponse: WorkerLoginResponse = {
                    success: false,
                    error: error.message
                };

                const request: WorkerLoginRequest = JSON.parse(msg.content.toString());
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

    private async validateWorker(request: WorkerLoginRequest): Promise<WorkerLoginResponse> {
        try {
            const { email, password } = request;

            const worker = await this.workerRepository.findByEmail(email);
            
            if (!worker) {
                return {
                    success: false,
                    error: "Worker does not exist, please apply for worker"
                };
            }

            if (!worker.isApproved) {
                return {
                    success: false,
                    error: "Your application is under verification, try after some time"
                };
            }

            const validPassword = await this.hashService.compare(password, worker.password);
            
            if (!validPassword) {
                return {
                    success: false,
                    error: "Invalid password"
                };
            }

            // Return worker data without password
            const { password: _, ...workerData } = worker;

            return {
                success: true,
                data: workerData
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}