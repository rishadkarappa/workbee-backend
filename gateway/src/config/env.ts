function requiredEnv(key:string):string {
    const value = process.env[key];
    if(!value) {
        throw new Error(`missing enviroment variable: ${key}`)
    }
    return value
}

export const ENV = {
    SERVER_PORT:process.env.PORT,
    JWT_SECRET : requiredEnv("JWT_SECRET")
} as const;


export function checkEnv() {
    const missing = Object.entries(ENV)
        .filter(([,value]) => value == null)
        .map(([key]) => key);
    
    if (missing.length) {
        throw new Error(`missing environment variables: ${missing.join(", ")}`)
    }
}
