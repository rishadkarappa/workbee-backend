import { Channel } from "amqplib";

export interface IRabbitMQChannel {
    getChannel(): Channel;
}