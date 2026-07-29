import winston from "winston";
import { ENV } from "./env";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const isProduction = ENV.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: ENV.LOG_LEVEL || (isProduction ? "info" : "debug"),

  defaultMeta: {
    service: ENV.SERVICE_NAME,
  },

  format: isProduction
    ? combine(
        timestamp(),
        errors({ stack: true }),
        json()
      )
    : combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        printf(({ timestamp, level, message, stack, service }) => {
          return `[${timestamp}] [${service}] ${level}: ${stack ?? message}`;
        })
      ),

  transports: [
    new winston.transports.Console(),
  ],
});