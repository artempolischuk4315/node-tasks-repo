function getErrorLogMessage (err) {
    return `Error with name "${err.name}" occurred. Status code: ` + err.statusCode +
    '\nRequest method: ' + err.requestMethod +
    '\nQuery params: ' + JSON.stringify(err.params) +
    '\nRequest body: ' + JSON.stringify(err.body) +
    '\nOperation: ' + JSON.stringify(err.operation) +
    '\n' + err.stack +
    '\n'
}

function getRequestLogMessage (req) {
    return 'Endpoint: ' + req.originalUrl +
    '\nMethod: ' + req.method +
    '\nQuery params: ' + JSON.stringify(req.query) +
    '\nRequest body: ' + JSON.stringify(req.body) +
    '\n'
}

module.exports = {
    getErrorLogMessage,
    getRequestLogMessage
}
