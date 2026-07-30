function getEnv(name:string):string{
    const value = process.env[name];

    if (!value) {
        throw new Error(`${value} is missing`)
    }

    return value
}

export const ENV = {
    PORT:getEnv("PORT"),
    RABBITMQ_URL:getEnv("RABBITMQ_URL"),
    JWT_SECRET:getEnv("JWT_SECRET"),
    NODE_ENV:getEnv("NODE_ENV"),
    LOG_LEVEL:getEnv("LOG_LEVEL"),
    SERVICE_NAME:getEnv("SERVICE_NAME"),
    LOGSTASH_HOST:getEnv("LOGSTASH_HOST"),
    LOGSTASH_PORT:getEnv("LOGSTASH_PORT"),

}