// Same Redis instance as auth service — just a new connection from the gateway process
import Redis from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD
    });

    redisClient.on("connect", () => console.log("Gateway Redis connected"));
    redisClient.on("error", (err) => console.error("Gateway Redis error:", err));
  }
  return redisClient;
};






