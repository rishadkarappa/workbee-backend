import amqp from "amqplib";

export const connectRabbit = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertExchange("chat.events", "topic", { durable: true });

  return channel;
};