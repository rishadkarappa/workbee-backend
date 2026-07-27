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
}
