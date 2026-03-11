
/**
 * inter serivce comm [worker service <-> auth serivce] : to delte refresh token after blocking worker
 */
import { injectable, inject } from "tsyringe";
import { RabbitMQConnection } from "../config/rabbitmq";

import { ITokenService } from "../../domain/services/ITokenService";

interface IWorkerBlockedEvent {
  workerId: string;
  isBlocked: boolean;
}

@injectable()
export class WorkerEventConsumer {
  private readonly EXCHANGE = "workbee.events";
  private readonly QUEUE = "auth.worker_blocked";
  private readonly ROUTING_KEY = "worker.blocked";

  constructor(
    @inject("TokenService") private _tokenService: ITokenService
  ) {}

  async start(): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();

      await channel.assertExchange(this.EXCHANGE, "topic", { durable: true });
      await channel.assertQueue(this.QUEUE, { durable: true });
      await channel.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);

      console.log("Auth service listening for worker.blocked events");

      channel.consume(
        this.QUEUE,
        async (msg:any) => {
          if (!msg) return;
          try {
            const event: IWorkerBlockedEvent = JSON.parse(msg.content.toString());
            await this.handleWorkerBlocked(event);
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing worker.blocked event:", error);
            channel.nack(msg, false, false);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("Failed to start WorkerEventConsumer:", error);
      throw error;
    }
  }

  private async handleWorkerBlocked(event: IWorkerBlockedEvent): Promise<void> {
    if (event.isBlocked) {
      await this._tokenService.deleteRefreshToken(event.workerId);
      console.log(`Refresh token deleted for blocked worker: ${event.workerId}`);
    } else {
      console.log(`Worker ${event.workerId} unblocked — no token action needed`);
    }
  }
}