import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "../logger/logger";

let prisma: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
};

export const connectDB = async (): Promise<void> => {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    logger.info("PaymentService PostgreSQL (Prisma) connected");
  } catch (error) {
    logger.error("PaymentService DB connection error:", error);
    throw error;
  }
};