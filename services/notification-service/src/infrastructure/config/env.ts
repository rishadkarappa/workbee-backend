function getEnvVariable(key:string):string {
    const value = process.env[key]

    if(!value) {
        throw new Error(`${value} is missing`)
    }

    return value;
}

export const ENV = {
    RABBITMQ_URL:getEnvVariable("RABBITMQ_URL"),
    PORT:getEnvVariable("PORT"),
    JWT_SECRET:getEnvVariable("JWT_SECRET"),
    CORS_ORIGIN:getEnvVariable("CORS_ORIGIN"),
    NODE_ENV:getEnvVariable("NODE_ENV"),
    LOG_LEVEL:getEnvVariable("LOG_LEVEL"),
    SERVICE_NAME:getEnvVariable("SERVICE_NAME"),
    LOGSTASH_HOST:getEnvVariable("LOGSTASH_HOST"),
    LOGSTASH_PORT:getEnvVariable("LOGSTASH_PORT"),
}
