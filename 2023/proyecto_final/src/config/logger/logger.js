import winston from "winston"

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors:{
        fatal: 'purple',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'green'
    }
}

const logger = winston.createLogger({
    levels:customLevelOpt.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/config/logger/logs/errors.log',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/config/logger/logs/errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/config/logger/logs/logs.log',
            level: 'warning',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/config/logger/logs/logs.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'src/config/logger/logs/logs.log',
            level: 'debug',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.simple()
            )
        })
        
    ]
})


export const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.debug(`${req.method} - ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}