import dotenv from "dotenv";
dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`env variable "${key}" is missing.`);
  }

  return value;
}

export const ENV = {
  RABBITMQ_URL: getEnvVariable("RABBITMQ_URL"),
  PORT: getEnvVariable("PORT"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  SERVICE_NAME: getEnvVariable("SERVICE_NAME"),
  LOG_LEVEL: getEnvVariable("LOG_LEVEL"),
  LOGSTASH_HOST: getEnvVariable("LOGSTASH_HOST"),
  LOGSTASH_PORT: getEnvVariable("LOGSTASH_PORT"),
};