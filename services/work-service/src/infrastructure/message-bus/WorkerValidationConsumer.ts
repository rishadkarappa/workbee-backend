/**
 * worker-service → auth-service communication (login validation)
 * Auth service sends: { email, password, correlationId }
 * Worker service checks worker and responds with: { success, data?, error? }
 */

import { Channel } from "amqplib";
import { injectable, inject } from "tsyringe";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { IHashService } from "../../domain/services/IHashService";
import { WorkerStatus } from "../../infrastructure/database/models/WorkerSchema";

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
    private readonly REQUEST_QUEUE = "worker.validate.request";
    private readonly RESPONSE_QUEUE = "worker.validate.response";

    constructor(
        @inject("WorkerRepository") private workerRepository: IWorkerRepository,
        @inject("HashService") private hashService: IHashService
    ) {}

    async start(channel: Channel): Promise<void> {

        await channel.assertQueue(this.REQUEST_QUEUE, { durable: true });
        await channel.assertQueue(this.RESPONSE_QUEUE, { durable: true });

        console.log(`✔ WorkerValidationConsumer listening on queue: ${this.REQUEST_QUEUE}`);

        channel.consume(this.REQUEST_QUEUE, async (msg) => {
            if (!msg) return;
            
            const request: WorkerLoginRequest = JSON.parse(msg.content.toString());

            try {
                const response = await this.validateWorker(request);

                // send response to response queue
                channel.sendToQueue(
                    this.RESPONSE_QUEUE,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: request.correlationId,
                        persistent: true
                    }
                );

                console.log(`=== Sent validation response for: ${request.email}`);
                channel.ack(msg);
            } catch (err: any) {
                console.error("==== Worker validation error:", err);

                const errorResponse: WorkerLoginResponse = {
                    success: false,
                    error: err.message || "Internal worker validation error"
                };

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

    private async validateWorker(req: WorkerLoginRequest): Promise<WorkerLoginResponse> {
        const { email, password } = req;

        const worker = await this.workerRepository.findByEmail(email);

        if (!worker) {
            return {
                success: false,
                error: "Worker does not exist. Please apply as a worker."
            };
        }

        // NEW: Using enum status instead of isApproved
        if (worker.status !== WorkerStatus.APPROVED) {
            return {
                success: false,
                error: "Your application has not been approved yet."
            };
        }

        const isPasswordCorrect = await this.hashService.compare(password, worker.password);

        if (!isPasswordCorrect) {
            return {
                success: false,
                error: "Invalid password."
            };
        }

        // remove password before sending data
        const { password: _, ...safeWorkerData } = worker;

        return {
            success: true,
            data: safeWorkerData
        };
    }
}
