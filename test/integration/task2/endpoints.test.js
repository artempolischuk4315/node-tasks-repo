const app = require('./../../../src/task2/userHandler');
const dataBase = require('./../../../src/task2/repository/dataBase');
const request = require('supertest');

describe('Create user', () => {
    const INVALID_MESSAGE = '"login" must be a valid email\n';
    let userData = {
        id: '261a404e-5213-440a-aa14-e3777d17fc05',
        login: 'artmai@l.com',
        password: '1saS',
        age: '19',
        isDeleted: false
    };

    test('POST /users', function (done) {
        request(app)
            .post('/users')
            .send(userData)
            .set('Accept', 'application/json')
            .expect(200, userData, done);
    });

    test('bad request POST /users', function (done) {
        userData.login = 'email';
        request(app)
            .post('/users')
            .send(userData)
            .set('Accept', 'application/json')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual(INVALID_MESSAGE);
                return done();
            });
    });
});

describe('Update user', () => {
    const INVALID_MESSAGE = '"password" with value "1" fails to match the required pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{3,30}$/\n';
    const USER_ID = '261a404e-5213-440a-aa14-e3777d17fc05';
    let userData;
    let user;

    beforeEach(() => {
        userData = {
            login: 'artmai@l.com',
            password: '1saS',
            age: '19',
            isDeleted: false
        };
        user = {
            id: '261a404e-5213-440a-aa14-e3777d17fc05',
            login: 'artmai@l.com',
            password: '1saS',
            age: '19',
            isDeleted: false
        };
        dataBase.set(USER_ID, user);
    });

    afterEach(() => {
        dataBase.clear()
    })

    test('PUT /users', function (done) {
        request(app)
            .put(`/users/${USER_ID}`)
            .send(userData)
            .set('Accept', 'application/json')
            .expect(200, user, done);
    });

    test('bad request PUT /users', function (done) {
        userData.password = '1';

        request(app)
            .put(`/users/${USER_ID}`)
            .send(userData)
            .set('Accept', 'application/json')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual(INVALID_MESSAGE);
                return done();
            });

    });

    test('not found PUT /users', function (done) {
        const USER_ID = 'wrongId';

        request(app)
            .put(`/users/${USER_ID}`)
            .send(userData)
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual(`User with id ${USER_ID} not found`);
                return done();
            });
    });
});

describe('Get user', () => {
    const USER_ID = '261a404e-5213-440a-aa14-e3777d17fc05';
    let user;
    let userCopy;

    beforeEach(() => {
        user = {
            id: '261a404e-5213-440a-aa14-e3777d17fc05',
            login: 'artmai@l.com',
            password: '1saS',
            age: '19',
            isDeleted: false
        };
        userCopy = {...user}
        userCopy.password = '*****'
        dataBase.set(USER_ID, user);
    });

    afterEach(() => {
        dataBase.clear()
    })

    test('GET /users', function (done) {
        request(app)
            .get(`/users/${USER_ID}`)
            .set('Accept', 'application/json')
            .expect(200, userCopy, done);
    });

    test('not found GET /users', function (done) {
        const USER_ID = 'wrongId';

        request(app)
            .get(`/users/${USER_ID}`)
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual(`User with id ${USER_ID} not found`);
                return done();
            });
    });
});

describe('Delete user', () => {
    const USER_ID = '261a404e-5213-440a-aa14-e3777d17fc05';
    let user;

    beforeEach(() => {
        user = {
            id: '261a404e-5213-440a-aa14-e3777d17fc05',
            login: 'artmai@l.com',
            password: '1saS',
            age: '19',
            isDeleted: false
        };
        dataBase.set(USER_ID, user);
    });

    afterEach(() => {
        dataBase.clear()
    })

    test('DELETE /users', function (done) {
        request(app)
            .delete(`/users/${USER_ID}`)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual('{\"message\":\"User successfully deleted\"}');
                return done();
            });
    });

    test('not found DELETE /users', function (done) {
        const USER_ID = 'wrongId';

        request(app)
            .delete(`/users/${USER_ID}`)
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toEqual(`User with id ${USER_ID} not found`);
                return done();
            });
    });
});

describe('Get auto suggested users list', () => {
    let secondUser
    let userCopy
    let secondUserCopy
    let user
    let substring = 'art'
    let limit = '5'

    beforeEach(() => {
        user = {
            id: '261a404e-5213-440a-aa14-e3777d17fc05',
            login: 'artmai@l.com',
            password: '1saS',
            age: '19',
            isDeleted: false
        };
        secondUser = {
            id: 'another' + user.id,
            login: 'another' + user.login,
            password: user.password,
            age: user.age,
            isDeleted: user.isDeleted
        }
        userCopy = {...user}
        secondUserCopy = {...secondUser}
        userCopy.password = '******'
        secondUserCopy.password = '******'
        dataBase.set(user.id, user)
        dataBase.set(secondUser.id, secondUser)
    });

    afterEach(() => {
        dataBase.clear()
    })

    test('GET /users', function (done) {
        request(app)
            .get(`/users?loginSubstring=${substring}&limit=${limit}`)
            .set('Accept', 'application/json')
            .expect(200, [userCopy, secondUserCopy], done);
    });

    test('GET /users with limit 1', function (done) {
        request(app)
            .get(`/users?loginSubstring=${substring}&limit=1`)
            .set('Accept', 'application/json')
            .expect(200, [userCopy], done);
    });

    test('empty GET /users', function (done) {
        substring = 'someString'
        request(app)
            .get(`/users?loginSubstring=${substring}&limit=1`)
            .set('Accept', 'application/json')
            .expect(200, [], done);
    });
});
