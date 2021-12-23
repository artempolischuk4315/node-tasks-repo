const dataBase = require('./dataBase');

async function saveUser(user) {
    dataBase.set(user.id, user);
    return user;
}

async function getUser(id) {
    const user = dataBase.get(id)

    if (user) {
        let copy = {...user}
        copy.password = '*****'
        return copy
    }
    return undefined
}

async function deleteUser(user) {
    let userCopy = { ...user };
    userCopy.isDeleted = true

    dataBase.set(userCopy.id, userCopy);
    return userCopy;
}

async function getAutoSuggestUsers(loginSubstring, limit) {
    const users = dataBase.values();

    const result = [];

    for (const user of users) {
        addUserToResultIfSatisfiesConditions(result, limit, user, loginSubstring);
    }

    return result;
}

function addUserToResultIfSatisfiesConditions(result, limit, user, loginSubstring) {
    let userToAdd;
    if (result.length < limit && user.login && user.login.includes(loginSubstring) && user.isDeleted === false) {
        userToAdd = { ...user };
        userToAdd.password = '******'
        result.push(userToAdd);
    }
}

module.exports = {
    saveUser,
    getUser,
    deleteUser,
    getAutoSuggestUsers
};
