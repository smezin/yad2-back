const { format, createLogger, transports } = require('winston');

const messageFormat = {
  format: format.combine(
    format.json(),
    format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'})
  )
}
const logger = createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: 'logger/error.log', level: 'error', ...messageFormat }),
    new transports.File({ filename: 'logger/combined.log', ...messageFormat }),
  ],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(messageFormat))
}
module.exports = {logger}
