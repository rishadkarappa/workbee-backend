import { container } from "tsyringe";
import { RabbitMQConnection } from "../config/rabbitmq";
import { WorkerEventConsumer } from "./WorkerEventConsumer"; 

export class RabbitMQClient {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("-- Messaging service already initialized");
      return;
    }

    try {
      await RabbitMQConnection.connect();
      console.log("-- RabbitMQ connected");

      const workerEventConsumer = container.resolve(WorkerEventConsumer);
      await workerEventConsumer.start();
      console.log("-- Worker event consumer started");

      this.isInitialized = true;
      console.log("-- Messaging Service initialized successfully");
    } catch (error) {
      console.error("-- Failed to initialize Messaging Service:", error);
      throw error;
    }
  }
}