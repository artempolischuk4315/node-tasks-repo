const sharedConstants = require('./../util/sharedConstants');
const userValidator = require('./../validator/userValidator');
const { CustomError } = require('./../data/CustomError');
const { createUser, getUser, updateUser, deleteUser, getAutoSuggestUsers } = require('../service/userService');
const CREATE_OPERATION = 'CREATE';
const UPDATE_OPERATION = 'UPDATE';
const DELETE_OPERATION = 'DELETE';
const GET_OPERATION = 'GET';

async function addUser(req, res, next) {
    const requestBody = req.body;
    const validationResult = userValidator.validateCreateRequest(requestBody);
    if (validationResult) {
        let message = getValidationFailedMessage(validationResult);
        return next(new CustomError(message, 400, req.method, req.body, req.query, CREATE_OPERATION))
    }

    return createUser(requestBody)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, req, requestBody.id, CREATE_OPERATION, next));
}

async function applyPatchToUser(req, res, next) {
    const requestBody = req.body;
    const validationResult = userValidator.validateUpdateRequest(requestBody);
    if (validationResult) {
        let message = getValidationFailedMessage(validationResult);
        return next(new CustomError(message, 400, req.method, req.body, req.query, UPDATE_OPERATION))
    }

    const id = req.params.id;
    return updateUser(id, req.body)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, req, id, UPDATE_OPERATION, next));
}

async function retrieveUser(req, res, next) {
    const id = req.params.id;
    return getUser(id)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, req, id, GET_OPERATION, next));
}

async function markUserAsDeleted(req, res, next) {
    const id = req.params.id;
    return deleteUser(id)
        .then(() => res.status(200).json({ message: 'User successfully deleted' }))
        .catch(error => resolveError(error, req, id, DELETE_OPERATION, next));
}

async function getAutoSuggestUsersList(req, res, next) {
    return getAutoSuggestUsers(req.query.loginSubstring, req.query.limit)
        .then((result) => res.status(200).json(result))
        .catch(() => {
            next(new CustomError('Error occurred during retrieving users',
                500, req.method, req.body, req.query, 'retrieving users list'))
        });
}

function resolveError(error, req, id, operation, next) {
    switch (error.message) {
        case sharedConstants.USER_ALREADY_EXISTS_MESSAGE:
            const error = new CustomError(`User with id ${id} already exists`, 403, req.method, req.body, req.query, operation)
            return next(error)
        case sharedConstants.USER_NOT_FOUND_MESSAGE:
            const notFoundError = new CustomError(`User with id ${id} not found`, 404, req.method, req.body, req.query, operation)
            return next(notFoundError)
        default: return getInternalServerErrorForUser(req, operation, id, next);
    }
}

function getInternalServerErrorForUser(req, operation, id, next) {
    return next(new CustomError(`Error occurred during ${operation} operation for user with id ${id}`,
        500, req.method, req.body, req.query, operation))
}

function getValidationFailedMessage(validationResult) {
    let message = '';
    for (let i = 0; i < validationResult.details.length; i++) {
        message = message + validationResult.details[i].message + '\n';
    }
    return message;
}

module.exports = {
    addUser,
    retrieveUser,
    updateUser: applyPatchToUser,
    deleteUser: markUserAsDeleted,
    getAutoSuggestUsers: getAutoSuggestUsersList
};
