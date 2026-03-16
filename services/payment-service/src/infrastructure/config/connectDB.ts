import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL Payment Service DB Connected");
  } catch (error) {
    console.error("Payment serivce DB connection error:", error);
  }
};