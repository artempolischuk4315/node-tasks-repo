const express = require('express');
const { addUser, retrieveUser, updateUser, deleteUser, getAutoSuggestUsers } = require('./../controller/userController');
const router = express.Router();

router.route('/')
    .get((req, res, next) => getAutoSuggestUsers(req, res, next))
    .post((req, res, next) => addUser(req, res, next));

router.route('/:id')
    .get((req, res, next) => retrieveUser(req, res, next))
    .put((req, res, next) => updateUser(req, res, next))
    .delete((req, res, next) => deleteUser(req, res, next));

module.exports = router;
