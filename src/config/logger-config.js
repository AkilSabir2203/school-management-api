import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const isVercelRuntime = Boolean(process.env.VERCEL);

const customFormat = printf(( { level, message, label, timestamp } ) => {
    return `${timestamp} : [${label}] : ${level} : ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        customFormat
    ),
    transports: [
        new transports.Console(),
        ...(!isVercelRuntime ? [new transports.File({ filename : 'combined.log'})] : [])
    ]
})

export default logger;