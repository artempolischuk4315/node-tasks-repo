class User {
    id;
    login;
    password;
    age;
    isDeleted;

    constructor(data) {
        Object.assign(this, data);
    }
}

module.exports = {
    User
};
