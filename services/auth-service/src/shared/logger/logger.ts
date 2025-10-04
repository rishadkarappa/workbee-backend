import { createLogger, format, transports } from "winston";
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, colorize} = format;

const logFormat = printf(({level, message, timestamp,stack}) => {
    return `${timestamp} [${level}]: ${stack || message}`;
})

const logger = createLogger({
    level:'info',
    format:combine(
        colorize(),
        timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        errors({stack:true}),
        logFormat
    ),
    transports:[
        new transports.Console(),
        new transports.DailyRotateFile({
            filename:'logs/app-%DATE%.log',
            datePattern:'YYYY-MM-DD',
            maxFiles:'5d',
            zippedArchive:true
        }),

        new transports.DailyRotateFile({
            filename:'logs/error-%DATE%.log',
            datePattern:'YYYY-MM-DD',
            level:'error',
            maxFiles:'10d',
            zippedArchive:true
        })
    ]
})

export default logger











