const sharedConstants = require('./../util/sharedConstants');
const userValidator = require('./../validator/userValidator');
const { createUser, getUser, updateUser, deleteUser, getAutoSuggestUsers } = require('../service/userService');
const CREATE_OPERATION = 'creating';
const UPDATE_OPERATION = 'updating';
const DELETE_OPERATION = 'deleting';
const GET_OPERATION = 'retrieving';

async function addUser(req, res) {
    const requestBody = req.body;
    const validationResult = userValidator.validateCreateRequest(requestBody);
    if (validationResult) {
        return res.status(400).json(validationResult.details);
    }

    return createUser(requestBody)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, res, requestBody.id, CREATE_OPERATION));
}

async function applyPatchToUser(req, res) {
    const requestBody = req.body;
    const validationResult = userValidator.validateUpdateRequest(requestBody);
    if (validationResult) {
        return res.status(400).json(validationResult.details);
    }

    const id = req.params.id;
    return updateUser(id, req.body)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, res, id, UPDATE_OPERATION));
}

async function retrieveUser(req, res) {
    const id = req.params.id;
    return getUser(id)
        .then((user) => res.status(200).json(user))
        .catch(error => resolveError(error, res, id, GET_OPERATION));
}

async function markUserAsDeleted(req, res) {
    const id = req.params.id;
    return deleteUser(id)
        .then(() => res.status(200).json({ message: 'User successfully deleted' }))
        .catch(error => resolveError(error, res, id, DELETE_OPERATION));
}

async function getAutoSuggestUsersList(req, res) {
    return getAutoSuggestUsers(req.query.loginSubstring, req.query.limit)
        .then((result) => res.status(200).json(result))
        .catch(() => res.status(500).json({ message: 'Error occurred during retrieving users' }));
}

function resolveError(error, res, id, operation) {
    switch (error.message) {
        case sharedConstants.USER_ALREADY_EXISTS_MESSAGE:
            res.status(403).json({ message: `User with id ${id} already exists` });
            break;
        case sharedConstants.USER_NOT_FOUND_MESSAGE:
            res.status(404).json({ message: `User with id ${id} not found` });
            break;
        default: getInternalServerErrorForUser(res, operation, id);
    }
}

function getInternalServerErrorForUser(res, operation, id) {
    res.status(500).json({ message: `Error occurred during ${operation} user with id ${id}` });
}

module.exports = {
    addUser,
    retrieveUser,
    updateUser: applyPatchToUser,
    deleteUser: markUserAsDeleted,
    getAutoSuggestUsers: getAutoSuggestUsersList
};
