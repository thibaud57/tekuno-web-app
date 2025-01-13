import { Request, Response } from 'express'
import { UserRecord } from 'firebase-admin/auth'
import { TypeRole } from '../auth/enums/type-role.enum'
import { CreateUserDto, UserEntity } from './models/user.model'
import {
    createUser,
    findAllUser,
    findOneUser,
    removeUser,
    updateUser,
} from './user-controller'

const mockListUsers = jest.fn()
const mockGetUser = jest.fn()
const mockCreateUser = jest.fn()
const mockUpdateUser = jest.fn()
const mockDeleteUser = jest.fn()
const mockSetCustomUserClaims = jest.fn()

jest.mock('firebase-admin', () => ({
    auth: jest.fn(() => ({
        listUsers: mockListUsers,
        getUser: mockGetUser,
        createUser: mockCreateUser,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser,
        setCustomUserClaims: mockSetCustomUserClaims,
    })),
}))

describe('UserController', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    const mockSend = jest.fn()
    const mockStatus = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockRequest = {}
        mockResponse = {
            status: mockStatus.mockReturnThis(),
            send: mockSend,
        }
        mockStatus.mockReturnThis()
    })

    describe('findAllUser', () => {
        it('should return all users successfully', async () => {
            const mockUsers: Partial<UserRecord>[] = [
                {
                    uid: '1',
                    email: 'test1@test.com',
                    displayName: 'Test 1',
                    customClaims: { roles: [TypeRole.MEMBER] },
                },
                {
                    uid: '2',
                    email: 'test2@test.com',
                    displayName: 'Test 2',
                    customClaims: { roles: [TypeRole.ADMIN] },
                },
            ]

            mockListUsers.mockResolvedValue({ users: mockUsers })

            await findAllUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: '1',
                        email: 'test1@test.com',
                    }),
                ])
            )
        })

        it('should handle empty users list', async () => {
            mockListUsers.mockResolvedValue({ users: [] })

            await findAllUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith([])
        })

        it('should handle Firebase error', async () => {
            const error = new Error('Firebase error')
            mockListUsers.mockRejectedValue(error)

            await findAllUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })
    })

    describe('findOneUser', () => {
        it('should return one user successfully', async () => {
            const mockUser: Partial<UserRecord> = {
                uid: '1',
                email: 'test@test.com',
                displayName: 'Test User',
                customClaims: { roles: [TypeRole.MEMBER] },
            }

            mockRequest.params = { id: '1' }
            mockGetUser.mockResolvedValue(mockUser)

            await findOneUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: '1',
                    email: 'test@test.com',
                })
            )
        })

        it('should handle user not found', async () => {
            mockRequest.params = { id: 'invalid-id' }
            const error = new Error('User not found')
            mockGetUser.mockRejectedValue(error)

            await findOneUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })
    })

    describe('createUser', () => {
        it('should create user successfully', async () => {
            const createUserDto: CreateUserDto = {
                email: 'new@test.com',
                password: 'password123',
                roles: [TypeRole.MEMBER],
            }

            mockRequest.body = createUserDto
            mockCreateUser.mockResolvedValue({ uid: 'new-uid' })

            await createUser(mockRequest as Request, mockResponse as Response)

            expect(mockCreateUser).toHaveBeenCalledWith({
                email: createUserDto.email,
                password: createUserDto.password,
            })
            expect(mockSetCustomUserClaims).toHaveBeenCalledWith('new-uid', {
                roles: createUserDto.roles,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should return 400 when email is missing', async () => {
            mockRequest.body = {
                password: 'password123',
                roles: [TypeRole.MEMBER],
            }

            await createUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Missing required fields',
            })
        })

        it('should return 400 when password is missing', async () => {
            mockRequest.body = {
                email: 'test@test.com',
                roles: [TypeRole.MEMBER],
            }

            await createUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Missing required fields',
            })
        })

        it('should return 400 when roles array is empty', async () => {
            mockRequest.body = {
                email: 'test@test.com',
                password: 'password123',
                roles: [],
            }

            await createUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Missing required fields',
            })
        })

        it('should handle Firebase creation error', async () => {
            const createUserDto: CreateUserDto = {
                email: 'new@test.com',
                password: 'password123',
                roles: [TypeRole.MEMBER],
            }

            mockRequest.body = createUserDto
            const error = new Error('Creation failed')
            mockCreateUser.mockRejectedValue(error)

            await createUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })
    })

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const updateUserDto: UserEntity = {
                id: '1',
                email: 'updated@test.com',
                displayName: 'Updated User',
                roles: [TypeRole.MEMBER],
                avatar: 'avatar.jpg',
            }

            mockRequest.params = { id: '1' }
            mockRequest.body = updateUserDto

            await updateUser(mockRequest as Request, mockResponse as Response)

            expect(mockUpdateUser).toHaveBeenCalledWith('1', {
                displayName: updateUserDto.displayName,
                email: updateUserDto.email,
                photoURL: updateUserDto.avatar,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should update user roles if provided', async () => {
            const updateUserDto: UserEntity = {
                id: '1',
                email: 'updated@test.com',
                roles: [TypeRole.MEMBER, TypeRole.DJ],
            }

            mockRequest.params = { id: '1' }
            mockRequest.body = updateUserDto

            await updateUser(mockRequest as Request, mockResponse as Response)

            expect(mockSetCustomUserClaims).toHaveBeenCalledWith('1', {
                roles: updateUserDto.roles,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should handle update error', async () => {
            mockRequest.params = { id: '1' }
            mockRequest.body = { email: 'test@test.com' }
            const error = new Error('Update failed')
            mockUpdateUser.mockRejectedValue(error)

            await updateUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })
    })

    describe('removeUser', () => {
        it('should delete user successfully', async () => {
            mockRequest.params = { id: '1' }
            mockGetUser.mockResolvedValue({
                customClaims: { roles: [TypeRole.MEMBER] },
            })

            await removeUser(mockRequest as Request, mockResponse as Response)

            expect(mockDeleteUser).toHaveBeenCalledWith('1')
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should not delete admin user', async () => {
            mockRequest.params = { id: '1' }
            mockGetUser.mockResolvedValue({
                customClaims: { roles: [TypeRole.ADMIN] },
            })

            await removeUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Cannot delete admin account',
            })
            expect(mockDeleteUser).not.toHaveBeenCalled()
        })

        it('should handle user not found before deletion', async () => {
            mockRequest.params = { id: '1' }
            const error = new Error('User not found')
            mockGetUser.mockRejectedValue(error)

            await removeUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })

        it('should handle deletion error', async () => {
            mockRequest.params = { id: '1' }
            mockGetUser.mockResolvedValue({
                customClaims: { roles: [TypeRole.MEMBER] },
            })
            const error = new Error('Deletion failed')
            mockDeleteUser.mockRejectedValue(error)

            await removeUser(mockRequest as Request, mockResponse as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ message: error.message })
        })
    })
})
