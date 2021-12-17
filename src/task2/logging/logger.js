const { createLogger, transports, format } = require('winston')

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.colorize(), format.simple())
        })
    ]
})

module.exports = logger
