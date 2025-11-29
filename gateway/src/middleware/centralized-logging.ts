import { createLogger, format, transports } from "winston";
import 'winston-daily-rotate-file';
import morgan from "morgan";
import path from "path";

const { combine, timestamp, printf, errors, colorize } = format;

//log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// console.log('winston + morgan log-----------------start-------------------------')

//logger instance
const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join("logs", "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "5d",
      zippedArchive: true,
    }),
    new transports.DailyRotateFile({
      filename: path.join("logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "10d",
      zippedArchive: true,
    }),
  ],
});

//morgan to log http req
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export { logger, httpLogger };
