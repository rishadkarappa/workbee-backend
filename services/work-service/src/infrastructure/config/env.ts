import dotenv from "dotenv";
dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable "${key}" is missing.`);
  }

  return value;
}

export const ENV = {
  RABBITMQ_URL: getEnvVariable("RABBITMQ_URL"),
};