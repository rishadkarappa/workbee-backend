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

}