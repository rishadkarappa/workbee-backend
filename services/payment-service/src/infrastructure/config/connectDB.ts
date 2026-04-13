import { Pool } from "pg";

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected PG pool error:", err);
    });
  }
  return pool;
};

export const connectDB = async (): Promise<void> => {
  try {
    const client = await getPool().connect();
    await client.query("SELECT 1");
    client.release();
    console.log("[PaymentService] PostgreSQL connected");
  } catch (error) {
    console.error("[PaymentService] DB connection error:", error);
    throw error;
  }
};

