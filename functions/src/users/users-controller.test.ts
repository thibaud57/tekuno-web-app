import {
    mockAuth,
    mockFirebaseAdmin,
    resetFirebaseMocks,
} from '../shared/mocks/firebase.mock'

jest.mock('firebase-admin', () => mockFirebaseAdmin)
jest.mock('../persons/persons-controller')

import { Request, Response } from 'express'
import { PersonType } from '../persons/enums/person-type.enum'
import {
    member2RolesMock,
    memberAdminMock,
} from '../persons/models/person.mock'
import {
    createPerson,
    findMemberByUserId,
    removePerson,
    updatePerson,
} from '../persons/persons-controller'
import { ApiError } from '../shared/models/api-error.model'
import {
    USER_ADMIN_UID,
    createFirebaseUserMock,
    createUserDtoMock,
    user2RolesMock,
    userAdminMock,
} from './models/user.mock'
import {
    createUser,
    findAllUser,
    findOneUser,
    removeUser,
    updateUser,
} from './users-controller'

describe('UsersController', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let mockSend: jest.Mock
    let mockStatus: jest.Mock
    let mockJson: jest.Mock

    beforeEach(() => {
        mockSend = jest.fn()
        mockStatus = jest.fn().mockReturnThis()
        mockJson = jest.fn()

        res = {
            send: mockSend,
            status: mockStatus,
            json: mockJson,
            locals: { uid: USER_ADMIN_UID },
        }

        // Reset all mocks
        jest.clearAllMocks()
        resetFirebaseMocks()
    })

    describe('findAllUser', () => {
        it('should return all users with member data', async () => {
            mockAuth.listUsers.mockResolvedValue({
                users: [
                    createFirebaseUserMock(userAdminMock),
                    createFirebaseUserMock(user2RolesMock),
                ],
            })

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock
                .mockResolvedValueOnce(memberAdminMock)
                .mockResolvedValueOnce(member2RolesMock)

            await findAllUser(req as Request, res as Response)

            expect(mockSend).toHaveBeenCalledWith([
                userAdminMock,
                user2RolesMock,
            ])
            expect(mockStatus).toHaveBeenCalledWith(200)
        })
    })

    describe('findOneUser', () => {
        it('should return one user with member data', async () => {
            req = { params: { id: userAdminMock.id } }
            mockAuth.getUser.mockResolvedValue(
                createFirebaseUserMock(userAdminMock)
            )

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(memberAdminMock)

            await findOneUser(req as Request, res as Response)

            expect(mockSend).toHaveBeenCalledWith(userAdminMock)
            expect(mockStatus).toHaveBeenCalledWith(200)
        })
    })

    describe('createUser', () => {
        it('should create a user with associated member successfully', async () => {
            req = { body: createUserDtoMock }
            const createdFirebaseUser = createFirebaseUserMock(user2RolesMock)
            mockAuth.createUser.mockResolvedValue(createdFirebaseUser)

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(member2RolesMock)

            await createUser(req as Request, res as Response)

            expect(mockAuth.createUser).toHaveBeenCalledWith({
                email: createUserDtoMock.email,
                password: createUserDtoMock.password,
            })
            expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith(
                createdFirebaseUser.uid,
                { roles: createUserDtoMock.roles }
            )
            expect(req.body).toEqual({
                personType: PersonType.MEMBER,
                name: 'User',
                email: createUserDtoMock.email,
                roles: createUserDtoMock.roles,
                userId: createdFirebaseUser.uid,
            })
            expect(mockSend).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(201)
        })

        it('should return 400 when missing required fields', async () => {
            const invalidUserData = {
                email: '',
                password: 'password123',
                roles: [],
            }
            req = { body: invalidUserData }

            await createUser(req as Request, res as Response)

            expect(mockAuth.createUser).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Missing required fields',
            })
        })

        it('should handle member creation failure and cleanup Firebase user', async () => {
            req = { body: createUserDtoMock }
            const createdFirebaseUser = createFirebaseUserMock(user2RolesMock)
            mockAuth.createUser.mockResolvedValue(createdFirebaseUser)

            const error: ApiError = new Error('Member creation failed')
            const createPersonMock = createPerson as jest.Mock
            createPersonMock.mockRejectedValue(error)

            await createUser(req as Request, res as Response)

            expect(mockAuth.deleteUser).toHaveBeenCalledWith(
                createdFirebaseUser.uid
            )
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Member creation failed',
            })
        })

        it('should handle Firebase user creation failure', async () => {
            req = { body: createUserDtoMock }
            const firebaseError = new Error('Firebase creation failed')
            mockAuth.createUser.mockRejectedValue(firebaseError)

            await createUser(req as Request, res as Response)

            expect(mockAuth.setCustomUserClaims).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firebase creation failed',
            })
        })
    })

    describe('updateUser', () => {
        it('should update user and member data successfully', async () => {
            const updateData = {
                ...user2RolesMock,
                email: 'newemail@mail.fr',
                avatar: '',
            }
            req = {
                params: { id: user2RolesMock.id },
                body: updateData,
            }

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(member2RolesMock)

            const updatePersonMock = updatePerson as jest.Mock
            updatePersonMock.mockImplementation(
                (req: Request, res: Response) => {
                    res.status(204).send()
                    return Promise.resolve()
                }
            )

            await updateUser(req as Request, res as Response)

            expect(mockAuth.updateUser).toHaveBeenCalledWith(
                user2RolesMock.id,
                {
                    displayName: updateData.displayName,
                    email: updateData.email,
                    photoURL: null,
                }
            )
            expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith(
                user2RolesMock.id,
                { roles: updateData.roles }
            )
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should handle Firebase update failure', async () => {
            const updateData = {
                ...user2RolesMock,
                email: 'newemail@mail.fr',
            }
            req = {
                params: { id: user2RolesMock.id },
                body: updateData,
            }

            const firebaseError: ApiError = new Error('Firebase update failed')
            mockAuth.updateUser.mockRejectedValue(firebaseError)

            await updateUser(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firebase update failed',
            })
        })

        it('should handle member update failure', async () => {
            const updateData = {
                ...user2RolesMock,
                email: 'newemail@mail.fr',
            }
            req = {
                params: { id: user2RolesMock.id },
                body: updateData,
            }

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(member2RolesMock)

            const error: ApiError = new Error(
                'Member update failed but user was updated'
            )
            const updatePersonMock = updatePerson as jest.Mock
            updatePersonMock.mockImplementation(
                (req: Request, res: Response) => {
                    throw error
                }
            )

            mockAuth.updateUser.mockResolvedValue(undefined)

            await updateUser(req as Request, res as Response)

            expect(mockAuth.updateUser).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Member update failed but user was updated',
            })
        })

        it('should update only Firebase user when no member exists', async () => {
            const updateData = {
                ...user2RolesMock,
                email: 'newemail@mail.fr',
            }
            req = {
                params: { id: user2RolesMock.id },
                body: updateData,
            }

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(null)

            mockAuth.updateUser.mockResolvedValue(undefined)

            await updateUser(req as Request, res as Response)

            expect(mockAuth.updateUser).toHaveBeenCalled()
            expect(updatePerson).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(204)
        })
    })

    describe('removeUser', () => {
        it('should not allow deleting admin user', async () => {
            req = { params: { id: userAdminMock.id } }
            mockAuth.getUser.mockResolvedValue(
                createFirebaseUserMock(userAdminMock)
            )

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(memberAdminMock)

            await removeUser(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Cannot delete admin account',
            })
        })

        it('should delete user and associated member successfully', async () => {
            req = { params: { id: user2RolesMock.id } }
            mockAuth.getUser.mockResolvedValue(
                createFirebaseUserMock(user2RolesMock)
            )

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(member2RolesMock)

            const removeMemberMock = removePerson as jest.Mock
            removeMemberMock.mockImplementation(
                (req: Request, res: Response) => {
                    res.status(204).send()
                    return Promise.resolve()
                }
            )

            await removeUser(req as Request, res as Response)

            expect(mockAuth.deleteUser).toHaveBeenCalledWith(user2RolesMock.id)
            expect(removeMemberMock).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should delete user when no member exists', async () => {
            req = { params: { id: user2RolesMock.id } }
            mockAuth.getUser.mockResolvedValue(
                createFirebaseUserMock(user2RolesMock)
            )

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(null)

            await removeUser(req as Request, res as Response)

            expect(mockAuth.deleteUser).toHaveBeenCalledWith(user2RolesMock.id)
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should handle Firebase deletion failure', async () => {
            req = { params: { id: user2RolesMock.id } }
            const firebaseError = new Error('Firebase deletion failed')
            mockAuth.getUser.mockRejectedValue(firebaseError)

            await removeUser(req as Request, res as Response)

            expect(mockAuth.deleteUser).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firebase deletion failed',
            })
        })

        it('should handle member deletion failure', async () => {
            req = { params: { id: user2RolesMock.id } }
            mockAuth.getUser.mockResolvedValue(
                createFirebaseUserMock(user2RolesMock)
            )

            const findMemberByUserIdMock = findMemberByUserId as jest.Mock
            findMemberByUserIdMock.mockResolvedValue(member2RolesMock)

            const error: ApiError = new Error('Member deletion failed')
            const removeMemberMock = removePerson as jest.Mock
            removeMemberMock.mockRejectedValue(error)

            await removeUser(req as Request, res as Response)

            expect(mockAuth.deleteUser).toHaveBeenCalledWith(user2RolesMock.id)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Member deletion failed',
            })
        })
    })
})
