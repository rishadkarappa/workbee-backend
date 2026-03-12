// /**
//  * rabbitmq connection and client intialization also in this file
//  */

import amqp from 'amqplib';

// How long to wait before trying to reconnect after a dropped connection
const RECONNECT_DELAY_MS = 5000;

export class RabbitMQConnection {
  private static connection: any = null;
  private static channel: any = null;
  private static isReconnecting = false;


  static async connect(): Promise<void> {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://localhost';

      // heartbeat:120 gives 2 minutes tolerance instead of 60s
      RabbitMQConnection.connection = await amqp.connect(url, { heartbeat: 120 });
      RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();

      console.log('-- RabbitMQ connected successfully');
      RabbitMQConnection.isReconnecting = false;

      // Handle connection errors (network blip, RabbitMQ restart)
      RabbitMQConnection.connection.on('error', (err: Error) => {
        console.error('-- RabbitMQ connection error:', err.message);
        RabbitMQConnection.connection = null;
        RabbitMQConnection.channel = null;
        RabbitMQConnection.scheduleReconnect();
      });

      // Handle heartbeat timeout — RabbitMQ fires 'close' when
      // the heartbeat is missed. Without this handler the dead connection
      // stays in memory and every subsequent getChannel() call uses it.
      RabbitMQConnection.connection.on('close', () => {
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

  static async getChannel(): Promise<any> {
    // Check both connection AND channel — both can die independently
    if (!RabbitMQConnection.connection || !RabbitMQConnection.channel) {
      await RabbitMQConnection.connect();
    }
    return RabbitMQConnection.channel;
  }

  private static scheduleReconnect(): void {
    // Guard: don't stack multiple reconnect timers
    if (RabbitMQConnection.isReconnecting) return;

    RabbitMQConnection.isReconnecting = true;
    console.log(`-- Reconnecting to RabbitMQ in ${RECONNECT_DELAY_MS / 1000}s...`);

    setTimeout(async () => {
      try {
        await RabbitMQConnection.connect();
        console.log('-- RabbitMQ reconnected successfully');
      } catch (err) {
        console.error('-- RabbitMQ reconnect attempt failed:', err);
        // connect() will call scheduleReconnect() again on failure,
        // so we reset the flag here to allow that
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