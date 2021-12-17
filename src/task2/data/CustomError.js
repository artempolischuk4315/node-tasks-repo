class CustomError extends Error {
    name;
    statusCode;
    requestMethod
    params;
    body;
    operation;

    constructor(message, statusCode, requestMethod, body, params, operation) {
        super(message);
        this.name = 'CustomError'
        this.statusCode = statusCode;
        this.requestMethod = requestMethod;
        this.body = body;
        this.params = params;
        this.operation = operation
    }
}

module.exports = {
    CustomError
};
