const dataBase = new Map();

async function saveUser(user) {
    dataBase.set(user.id, user);
    return user;
}

async function getUser(id) {
    return dataBase.get(id);
}

async function getAll() {
    return dataBase.values();
}

module.exports = {
    saveUser,
    getUser,
    getAll
};
