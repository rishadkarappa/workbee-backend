// /**
//  * rabbitmq connection and client intialization also in this file
//  */

import amqp, { Channel, ChannelModel } from 'amqplib';
import { ENV } from './env';

const RECONNECT_DELAY_MS = 5000;

export class RabbitMQConnection {
  private static connection: ChannelModel | null = null;
  private static channel: Channel | null = null;
  private static isReconnecting = false;

  static async connect(): Promise<void> {
    try {
      const url = ENV.RABBITMQ_URL;

      const connection = await amqp.connect(url, { heartbeat: 120 });
      const channel = await connection.createChannel();

      RabbitMQConnection.connection = connection;
      RabbitMQConnection.channel = channel;

      console.log('-- RabbitMQ connected successfully');
      RabbitMQConnection.isReconnecting = false;

      connection.on('error', (err: Error) => {
        console.error('-- RabbitMQ connection error:', err.message);
        RabbitMQConnection.connection = null;
        RabbitMQConnection.channel = null;
        RabbitMQConnection.scheduleReconnect();
      });

      connection.on('close', () => {
        console.warn('-- RabbitMQ connection closed — scheduling reconnect...');
        RabbitMQConnection.connection = null;
        RabbitMQConnection.channel = null;
        RabbitMQConnection.scheduleReconnect();
      });

    } catch (error) {
      console.error('-- RabbitMQ connection failed:', error);
      RabbitMQConnection.connection = null;
      RabbitMQConnection.channel = null;
      RabbitMQConnection.scheduleReconnect();
      throw error;
    }
  }

  static async getChannel(): Promise<Channel> {
    if (!RabbitMQConnection.connection || !RabbitMQConnection.channel) {
      await RabbitMQConnection.connect();
    }
    if (!RabbitMQConnection.channel) {
      throw new Error('RabbitMQ channel unavailable after connect attempt');
    }
    return RabbitMQConnection.channel;
  }

  private static scheduleReconnect(): void {
    if (RabbitMQConnection.isReconnecting) return;

    RabbitMQConnection.isReconnecting = true;
    console.log(`-- Reconnecting to RabbitMQ in ${RECONNECT_DELAY_MS / 1000}s...`);

    setTimeout(async () => {
      try {
        await RabbitMQConnection.connect();
        console.log('-- RabbitMQ reconnected successfully');
      } catch (err) {
        console.error('-- RabbitMQ reconnect attempt failed:', err);
        RabbitMQConnection.isReconnecting = false;
      }
    }, RECONNECT_DELAY_MS);
  }

  static async close(): Promise<void> {
    if (RabbitMQConnection.channel) await RabbitMQConnection.channel.close();
    if (RabbitMQConnection.connection) await RabbitMQConnection.connection.close();
    RabbitMQConnection.connection = null;
    RabbitMQConnection.channel = null;
  }
}
