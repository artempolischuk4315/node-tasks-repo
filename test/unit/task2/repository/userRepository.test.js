const userRepository = require('./../../../../src/task2/repository/usersRepository')
const dataBase = require('./../../../../src/task2/repository/dataBase');

const USER_ID = 'testid'
const USER_LOGIN = 'login'
const USER_PASSWORD = 'password'
const USER_AGE = 'age'
const IS_DELETED = false
const user = {
    id: USER_ID,
    login: USER_LOGIN,
    password: USER_PASSWORD,
    age: USER_AGE,
    isDeleted: IS_DELETED
}

beforeAll(() => {
    jest.spyOn(dataBase, 'set')
    jest.spyOn(dataBase, 'get')
    jest.spyOn(dataBase, 'values')
})

describe('Create user', () => {
    test('should return newly created user', async () => {
        const result = await userRepository.saveUser(user)

        expect(result).toEqual(user)
    })

    test('should pass expected arguments to set method of dataBase', async () => {
        await userRepository.saveUser(user)

        expect(dataBase.set).toHaveBeenCalledWith(USER_ID, user)
    })
})

describe('Get user', () => {
    let userCopy = {...user}

    beforeAll(() => {
        userCopy.password = '*****'
        dataBase.set(USER_ID, user)
    })

    test('should return copy of existing user', async () => {
        const result = await userRepository.getUser(USER_ID)

        expect(result === user).toBe(false)
        expect(result).toEqual(userCopy)
    })

    test('should return undefined when user is absent', async () => {
        dataBase.delete(USER_ID)

        const result = await userRepository.getUser(USER_ID)

        expect(result).toEqual(undefined)
    })

    test('should pass expected argument to get method of dataBase', async () => {
        await userRepository.saveUser(user)

        expect(dataBase.get).toHaveBeenCalledWith(USER_ID)
    })
})

describe('Delete user', () => {
    let userCopy = {...user}

    beforeAll(() => {
        userCopy.isDeleted = true
        dataBase.set(USER_ID, user)
    })

    test('should return copy of deleted user', async () => {
        const result = await userRepository.deleteUser(user)

        expect(result === user).toBe(false)
        expect(result).toEqual(userCopy)
    })

    test('should pass expected arguments to set method of dataBase', async () => {
        await userRepository.deleteUser(user)

        expect(dataBase.set).toHaveBeenCalledWith(USER_ID, userCopy)
    })
})

describe('Get auto suggest users', () => {
    let secondUser
    let userCopy
    let secondUserCopy

    beforeEach(() => {
        secondUser = {
            id: 'another' + USER_ID,
            login: 'another' + USER_LOGIN,
            password: USER_PASSWORD,
            age: USER_AGE,
            isDeleted: IS_DELETED
        }
        userCopy = {...user}
        secondUserCopy = {...secondUser}
        userCopy.password = '******'
        secondUserCopy.password = '******'
        dataBase.set(user.id, user)
        dataBase.set(secondUser.id, secondUser)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return expected users', async () => {
        const result = await userRepository.getAutoSuggestUsers(USER_LOGIN, 2)

        expect(result).toEqual([userCopy, secondUserCopy])
    })

    test('should return only not deleted users', async () => {
        secondUser.isDeleted = true

        const result = await userRepository.getAutoSuggestUsers(USER_LOGIN, 2)

        expect(result).toEqual([userCopy])
    })

    test('should return only users with corresponding login', async () => {
        const result = await userRepository.getAutoSuggestUsers('another', 2)

        expect(result).toEqual([secondUserCopy])
    })

    test('should return empty when no users found', async () => {
        secondUser.isDeleted = true

        const result = await userRepository.getAutoSuggestUsers('argument', 2)

        expect(result).toEqual([])
    })

    test('should call values method of database', async () => {
        await userRepository.getAutoSuggestUsers('another', 2)

        expect(dataBase.values).toHaveBeenCalledTimes(1)
    })
})
