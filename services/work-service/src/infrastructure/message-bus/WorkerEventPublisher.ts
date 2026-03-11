/**
 * inter serivce comm with [work-auth] : to delete refresh token after blocking worker
 */

import { injectable } from "tsyringe";
import { RabbitMQConnection } from "../config/rabbitmq";

export interface IWorkerBlockedEvent {
  workerId: string;
  isBlocked: boolean;
}

@injectable()
export class WorkerEventPublisher {
  private readonly EXCHANGE = "workbee.events";

  async publishWorkerBlocked(event: IWorkerBlockedEvent): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();
      await channel.assertExchange(this.EXCHANGE, "topic", { durable: true });

      const message = Buffer.from(JSON.stringify(event));
      channel.publish(this.EXCHANGE, "worker.blocked", message, {
        persistent: true,
        contentType: "application/json",
      });

      console.log(`Published worker.blocked event for worker: ${event.workerId}, isBlocked: ${event.isBlocked}`);
    } catch (error) {
      console.error("Failed to publish worker blocked event:", error);
      throw error;
    }
  }
}