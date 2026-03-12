
// /**
//  * inter serivce comm [worker service <-> auth serivce] : to delte refresh token after blocking worker
//  */

import { injectable, inject } from "tsyringe";
import { RabbitMQConnection } from "../config/rabbitmq";
import { ITokenService } from "../../domain/services/ITokenService";
import RedisClient from "../config/RedisClient";

interface IWorkerBlockedEvent {
  workerId: string;
  isBlocked: boolean;
}

@injectable()
export class WorkerEventConsumer {
  private readonly EXCHANGE = "workbee.events";
  private readonly QUEUE = "auth.worker_blocked";
  private readonly ROUTING_KEY = "worker.blocked";
  private redis = RedisClient.getInstance();

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
    const { workerId, isBlocked } = event;

    if (isBlocked) {
      // 1. Delete refresh token → next refresh attempt fails
      await this._tokenService.deleteRefreshToken(workerId);

      // 2. Add to blocklist → gateway rejects ALL requests immediately
      //    TTL = 900s (15min) matches access token expiry
      await this.redis.setex(`blocked:${workerId}`, 900, "1");

      console.log(`Worker blocked + refresh token deleted + blocklist set: ${workerId}`);
    } else {
      // Unblocked — remove from blocklist
      await this.redis.del(`blocked:${workerId}`);
      console.log(`Worker unblocked + removed from blocklist: ${workerId}`);
    }
  }
}