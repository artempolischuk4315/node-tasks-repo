const express = require('express');
const { addUser, retrieveUser, updateUser, deleteUser, getAutoSuggestUsers } = require('./../controller/userController');
const router = express.Router();

router.route('/')
    .get((req, res) => getAutoSuggestUsers(req, res))
    .post((req, res) => addUser(req, res));

router.route('/:id')
    .get((req, res) => retrieveUser(req, res))
    .put((req, res) => updateUser(req, res))
    .delete((req, res) => deleteUser(req, res));

module.exports = router;
