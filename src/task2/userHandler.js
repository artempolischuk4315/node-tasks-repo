const express = require('express');
const users = require('./router/users');
const logger = require('./logging/logger');
const { CustomError } = require('./data/CustomError');
const { getRequestLogMessage, getErrorLogMessage } = require('./logging/loggingMessagesProvider');
const app = express();
app.use(express.json());

process
    .on('unhandledRejection', (reason) => {
        logger.error('Unhandled promise exception occurred with reason:\n' + reason.stack)
        process.exit(1);
    })
    .on('uncaughtException', err => {
        logger.error('Uncaught exception occurred. ' + err.stack);
        process.exit(1);
    });

app.use('/users', function (req, res, next) {
    logger.info(getRequestLogMessage(req))
    next()
})

app.use('/users', users);

app.use(function (err, req, res, next) {

    if (err instanceof CustomError) {
        logger.error(getErrorLogMessage(err))
        return res.status(err.statusCode).send(err.message)
    }

    logger.error(err.stack)
    return res.status(500).send('Internal error occurred')
})

app.listen(3015, () => console.log('Listening at http://localhost:3015'));
