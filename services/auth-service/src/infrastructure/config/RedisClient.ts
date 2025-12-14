import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis;

    private constructor() {}

    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD || undefined,
                db: 0,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });

            RedisClient.instance.on('connect', () => {
                console.log('Redis connected successfully');
            });

            RedisClient.instance.on('error', (err) => {
                console.error('Redis connection error:', err);
            });
        }
        return RedisClient.instance;
    }

    public static async disconnect(): Promise<void> {
        if (RedisClient.instance) {
            await RedisClient.instance.quit();
        }
    }
}

export default RedisClient;