import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),

    new winston.transports.Http({
      host: "logstash",
      port: 5050,
      path: "/",
      ssl: false
    })
  ]
});

export default logger;
