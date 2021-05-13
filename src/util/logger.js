import fs from 'fs';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file'

// next to src dir
const logDirectory = `${__dirname}/../../logs`

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

const { combine, printf } = winston.format
const logFormat = printf(({ level, message }) => `${level}: ${message}`)

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(logFormat),
  transports: [
    // info log setting
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`,
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: true,
      zippedArchive: true,
    }),
    // error log setting
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: true,
      zippedArchive: true,
    }),
  ],
})

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
)

export { logger }
