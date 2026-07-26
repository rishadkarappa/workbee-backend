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
    RABBITMQ_URL: getEnv("RABBITMQ_URL")

}