const winston = require('winston')
const { format, createLogger, transports } = require('winston');

const fileMessageFormat = {
  format: format.combine(
    format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
    format.json(),
      
  )
}
const consoleMessageFormat = {
  format: format.combine(
    format.colorize(),
    format.simple()    
  )
}
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan'
});
const logger = createLogger({
  level: 'info',
  //defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'logger/error.log', level: 'warn', ...fileMessageFormat }),
    new transports.File({ filename: 'logger/combined.log', ...fileMessageFormat }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(consoleMessageFormat))
}



module.exports = {logger}
