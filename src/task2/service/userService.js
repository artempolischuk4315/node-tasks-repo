const userRepository = require('./../repository/usersRepository');
const sharedConstants = require('./../util/sharedConstants');
const { User } = require('./../data/User');

async function createUser(payload) {
    let user = await userRepository.getUser(payload.id);
    if (!user) {
        user = new User(payload);
        return userRepository.saveUser(user);
    }
    throw new Error(sharedConstants.USER_ALREADY_EXISTS_MESSAGE);
}

async function updateUser(id, userData) {
    const user = await userRepository.getUser(id);
    if (user) {
        updateUserWithNewData(user, userData);
        return await userRepository.saveUser(user);
    }
    throw new Error(sharedConstants.USER_NOT_FOUND_MESSAGE);
}

async function getUser(id) {
    const user = await userRepository.getUser(id);
    if (user) {
        return user;
    }
    throw new Error(sharedConstants.USER_NOT_FOUND_MESSAGE);
}

async function deleteUser(id) {
    const user = await userRepository.getUser(id);
    if (user) {
        user.isDeleted = true;
        return await userRepository.saveUser(user);
    }
    throw new Error(sharedConstants.USER_NOT_FOUND_MESSAGE);
}

async function getAutoSuggestUsers(loginSubstring, limit) {
    const users = await userRepository.getAll();
    const result = [];

    for (const user of users) {
        addUserToResultIfSatisfiesConditions(result, limit, user, loginSubstring);
    }

    return result;
}

function addUserToResultIfSatisfiesConditions(result, limit, user, loginSubstring) {
    if (result.length < limit && user.login && user.login.includes(loginSubstring)) {
        result.push(user);
    }
}

function updateUserWithNewData(user, userData) {
    user.login = userData.login;
    user.password = userData.password;
    user.age = userData.age;
    user.isDeleted = userData.isDeleted;
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAutoSuggestUsers
};
