function getEnv(name:string):string {
    const value = process.env[name]

    if(!value) {
        throw new Error(`${name} is missing`)
    }

    return value
}

export const ENV = {
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    PORT: getEnv("PORT"),
    RABBITMQ_URL: getEnv("RABBITMQ_URL"),
    SERVICE_NAME: getEnv("SERVICE_NAME"),
    LOG_LEVEL: getEnv("LOG_LEVEL"),
    NODE_ENV: getEnv("NODE_ENV"),
    LOGSTASH_HOST: getEnv("LOGSTASH_HOST"),
    LOGSTASH_PORT: getEnv("LOGSTASH_PORT"),

}