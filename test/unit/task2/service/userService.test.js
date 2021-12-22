const userService = require('./../../../../src/task2/service/userService')
const userRepository = require('./../../../../src/task2/repository/usersRepository')

jest.mock('./../../../../src/task2/repository/usersRepository')

const USER_ALREADY_EXISTS_MESSAGE = 'User with such id already exists'
const USER_NOT_FOUND_MESSAGE = 'User not found'
const USER_ID = 'id'
const USER_LOGIN = 'login'
const USER_PASSWORD = 'password'
const USER_AGE = 'age'
const IS_DELETED = false
const payload = {
    id: USER_ID,
    login: USER_LOGIN,
    password: USER_PASSWORD,
    age: USER_AGE,
    isDeleted: IS_DELETED
}

const user = {
    id: USER_ID,
    login: USER_LOGIN,
    password: USER_PASSWORD,
    age: USER_AGE,
    isDeleted: IS_DELETED
}

afterAll(() => {
    jest.resetAllMocks()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('Create user', () => {
    test('should return newly created user', async () => {
        userRepository.getUser.mockResolvedValue(null)
        userRepository.saveUser.mockResolvedValue(user)

        const result = await userService.createUser(payload)

        expect(result).toEqual(user)
    })

    test('should throw expected exception when user already exists', async () => {
        const error = new Error(USER_ALREADY_EXISTS_MESSAGE)
        userRepository.getUser.mockResolvedValue(user)

        await expect(async () => {
            await userService.createUser(payload)
        }).rejects.toThrow(error)
    })

    test('should pass expected argument to save method of user repository', async () => {
        userRepository.getUser.mockResolvedValue(null)

        await userService.createUser(payload)

        expect(userRepository.saveUser).toHaveBeenCalledWith(user)
    })

    test('should pass expected argument to get method of user repository', async () => {
        await userService.createUser(payload)

        expect(userRepository.getUser).toHaveBeenCalledWith(USER_ID)
    })
})

describe('Get user', () => {
    test('should return expected user', async () => {
        userRepository.getUser.mockResolvedValue(user)

        const result = await userService.getUser(USER_ID)

        expect(result).toEqual(user)
    })

    test('should throw expected exception when user not found', async () => {
        const error = new Error(USER_NOT_FOUND_MESSAGE)
        userRepository.getUser.mockResolvedValue(null)

        await expect(async () => {
            await userService.getUser(USER_NOT_FOUND_MESSAGE)
        }).rejects.toThrow(error)
    })

    test('should pass expected argument to user repository', async () => {
        userRepository.getUser.mockResolvedValue(user)

        await userService.getUser(USER_ID)

        expect(userRepository.getUser).toHaveBeenCalledWith(USER_ID)
    })
})

describe('Delete user', () => {
    test('should return deleted user', async () => {
        userRepository.getUser.mockResolvedValue(user)
        userRepository.deleteUser.mockResolvedValue(user)

        const result = await userService.deleteUser(USER_ID)

        expect(result).toEqual(user)
    })

    test('should throw expected exception when user not found', async () => {
        const error = new Error(USER_NOT_FOUND_MESSAGE)
        userRepository.getUser.mockResolvedValue(null)

        await expect(async () => {
            await userService.deleteUser(USER_NOT_FOUND_MESSAGE)
        }).rejects.toThrow(error)
    })

    test('should pass expected argument to delete method of user repository', async () => {
        userRepository.getUser.mockResolvedValue(user)

        await userService.deleteUser(USER_ID)

        expect(userRepository.deleteUser).toHaveBeenCalledWith(user)
    })

    test('should pass expected argument to get method of user repository', async () => {
        userRepository.getUser.mockResolvedValue(user)

        await userService.deleteUser(USER_ID)

        expect(userRepository.getUser).toHaveBeenCalledWith(USER_ID)
    })
})

describe('Update user', () => {
    const updatedUser = {
        id: USER_ID,
        login: 'newLogin',
        password: 'newPassword',
        age: 'newAge',
        isDeleted: false
    }
    const updatePayload = {
        login: 'newLogin',
        password: 'newPassword',
        age: 'newAge',
        isDeleted: false
    }

    test('should return updated user', async () => {
        userRepository.getUser.mockResolvedValue(user)
        userRepository.saveUser.mockResolvedValue(user)

        const result = await userService.updateUser(USER_ID, updatePayload)

        expect(result).toEqual(user)
    })

    test('should throw expected exception when user not found', async () => {
        userRepository.getUser.mockResolvedValue(null)
        const error = new Error(USER_NOT_FOUND_MESSAGE)

        await expect(async () => {
            await userService.updateUser(USER_ID, updatePayload)
        }).rejects.toThrow(error)
    })

    test('should pass expected argument to save method of user repository', async () => {
        userRepository.getUser.mockResolvedValue(user)

        await userService.updateUser(USER_ID, updatePayload)

        expect(userRepository.saveUser).toHaveBeenCalledWith(updatedUser)
    })

    test('should pass expected argument to get method of user repository', async () => {
        userRepository.getUser.mockResolvedValue(user)

        await userService.updateUser(USER_ID, updatePayload)

        expect(userRepository.getUser).toHaveBeenCalledWith(USER_ID)
    })
})

describe('Get auto suggest users list', () => {
    const autoSuggestUsersList = [ user ]
    const SUBSTRING = 'login';
    const LIMIT = '5';

    beforeAll(() => {
        userRepository.getAutoSuggestUsers.mockResolvedValue(autoSuggestUsersList)
    })

    test('should return auto suggest users list', async () => {
        const result = await userService.getAutoSuggestUsers(SUBSTRING, LIMIT)

        expect(result).toEqual(autoSuggestUsersList)
    })

    test('should pass expected substring argument to getAutoSuggestUsers method of user repository', async () => {
        await userService.getAutoSuggestUsers(SUBSTRING, LIMIT)

        expect(userRepository.getAutoSuggestUsers).toHaveBeenCalledWith(SUBSTRING, expect.anything())
    })

    test('should pass expected limit argument to getAutoSuggestUsers method of user repository', async () => {
        await userService.getAutoSuggestUsers(SUBSTRING, LIMIT)

        expect(userRepository.getAutoSuggestUsers).toHaveBeenCalledWith(expect.anything(), LIMIT)
    })
})
