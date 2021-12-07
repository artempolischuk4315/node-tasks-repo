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
        return await userRepository.saveUser(updateUserWithNewData(user, userData));
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
        return userRepository.deleteUser(user);
    }
    throw new Error(sharedConstants.USER_NOT_FOUND_MESSAGE);
}

async function getAutoSuggestUsers(loginSubstring, limit) {
    return await userRepository.getAutoSuggestUsers(loginSubstring, limit)
}

function updateUserWithNewData(user, userData) {
    const updatedUser = { ...user };

    updatedUser.login = userData.login;
    updatedUser.password = userData.password;
    updatedUser.age = userData.age;
    updatedUser.isDeleted = userData.isDeleted;

    return updatedUser;
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAutoSuggestUsers
};
