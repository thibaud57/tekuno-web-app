import {
    mockAdd,
    mockCollection,
    mockDelete,
    mockDoc,
    mockFirebaseAdmin,
    mockGet,
    mockLimit,
    mockUpdate,
    mockWhere,
    resetFirebaseMocks,
    setupFirestoreMocks,
} from '../shared/models/firebase.mock'

import { Request, Response } from 'express'
import { RoleType } from '../auth/enums/role-type.enum'
import { FirebaseAuthService } from '../auth/services/firebase-auth.service'
import { OrganizationType } from './enums/organization-type.enum'
import { PersonType } from './enums/person-type.enum'
import {
    customerMock,
    member2RolesMock,
    memberAdminMock,
    orgaTekunoMock,
} from './models/person/person.mock'
import {
    createPerson,
    findAllPerson,
    findMemberByUserId,
    findOnePerson,
    removePerson,
    updatePerson,
} from './persons.controller'

jest.mock('firebase-admin', () => mockFirebaseAdmin)

describe('PersonsController', () => {
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
            locals: {
                uid: memberAdminMock.id,
                roles: [RoleType.ADMIN],
            },
        }

        jest.clearAllMocks()
        resetFirebaseMocks()
        setupFirestoreMocks()
    })

    describe('findAllPerson', () => {
        it('should return all persons', async () => {
            const persons = [customerMock, memberAdminMock]
            const mockQuery = {
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue({
                    docs: persons.map(person => ({
                        id: person.id,
                        data: () => ({ ...person }),
                    })),
                }),
            }
            mockCollection.mockReturnValue(mockQuery)

            req = { query: {} }

            await findAllPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockQuery.get).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(persons)
        })

        it('should handle Firestore error', async () => {
            const error = new Error('Firestore error')
            const mockQuery = {
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockRejectedValue(error),
            }
            mockCollection.mockReturnValue(mockQuery)

            req = { query: {} }

            await findAllPerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })

        it('should apply filters when query parameters are provided', async () => {
            const persons = [memberAdminMock]
            const mockQuery = {
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue({
                    docs: persons.map(person => ({
                        id: person.id,
                        data: () => ({ ...person }),
                    })),
                }),
            }
            mockCollection.mockReturnValue(mockQuery)

            req = {
                query: {
                    personType: PersonType.MEMBER,
                    userId: memberAdminMock.userId,
                },
            }

            await findAllPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockQuery.where).toHaveBeenCalledWith(
                'personType',
                '==',
                PersonType.MEMBER
            )
            expect(mockQuery.where).toHaveBeenCalledWith(
                'userId',
                '==',
                memberAdminMock.userId
            )
            expect(mockQuery.get).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(persons)
        })

        it('should filter by organizationType', async () => {
            const persons = [orgaTekunoMock]
            const mockQuery = {
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue({
                    docs: persons.map(person => ({
                        id: person.id,
                        data: () => ({ ...person }),
                    })),
                }),
            }
            mockCollection.mockReturnValue(mockQuery)

            req = {
                query: {
                    organizationType: OrganizationType.ASSOCIATION,
                },
            }

            await findAllPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockQuery.where).toHaveBeenCalledWith(
                'organizationType',
                '==',
                OrganizationType.ASSOCIATION
            )
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(persons)
        })

        it('should combine organizationType and personType filters', async () => {
            const persons = [orgaTekunoMock]
            const mockQuery = {
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue({
                    docs: persons.map(person => ({
                        id: person.id,
                        data: () => ({ ...person }),
                    })),
                }),
            }
            mockCollection.mockReturnValue(mockQuery)

            req = {
                query: {
                    organizationType: OrganizationType.ASSOCIATION,
                    personType: PersonType.ORGANIZATION,
                },
            }

            await findAllPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockQuery.where).toHaveBeenCalledWith(
                'organizationType',
                '==',
                OrganizationType.ASSOCIATION
            )
            expect(mockQuery.where).toHaveBeenCalledWith(
                'personType',
                '==',
                PersonType.ORGANIZATION
            )
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(persons)
        })
    })

    describe('findMemberByUserId', () => {
        it('should return member when found', async () => {
            mockGet.mockResolvedValue({
                empty: false,
                docs: [
                    {
                        id: memberAdminMock.id,
                        data: () => ({ ...memberAdminMock }),
                    },
                ],
            })

            const result = await findMemberByUserId(memberAdminMock.userId!)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockWhere).toHaveBeenCalledWith(
                'userId',
                '==',
                memberAdminMock.userId
            )
            expect(mockLimit).toHaveBeenCalledWith(1)
            expect(result).toEqual(memberAdminMock)
        })

        it('should return null when member not found', async () => {
            mockGet.mockResolvedValue({
                empty: true,
                docs: [],
            })

            const result = await findMemberByUserId('non-existent-id')

            expect(result).toBeNull()
        })
    })

    describe('findOnePerson', () => {
        it('should return person when found', async () => {
            req = { params: { id: customerMock.id } }
            mockGet.mockResolvedValue({
                exists: true,
                id: customerMock.id,
                data: () => ({ ...customerMock }),
            })

            await findOnePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(customerMock.id)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(customerMock)
        })

        it('should return 404 when person not found', async () => {
            req = { params: { id: 'non-existent-id' } }
            mockGet.mockResolvedValue({
                exists: false,
            })

            await findOnePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Person not found',
            })
        })

        it('should handle Firestore error', async () => {
            req = { params: { id: customerMock.id } }
            const error = new Error('Firestore error')
            mockGet.mockRejectedValue(error)

            await findOnePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })
    })

    describe('createPerson', () => {
        it('should create person successfully', async () => {
            const newPerson = {
                ...member2RolesMock,
                id: undefined,
                createdAt: undefined,
                createdBy: undefined,
            }
            req = { body: newPerson }
            const newId = 'new-person-id'
            mockAdd.mockResolvedValue({ id: newId })

            await createPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockAdd).toHaveBeenCalledWith({
                ...newPerson,
                createdAt: expect.any(Object),
                createdBy: memberAdminMock.id,
            })
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockSend).toHaveBeenCalledWith({ id: newId })
        })

        it('should handle Firestore error', async () => {
            const newPerson = {
                ...member2RolesMock,
                id: undefined,
                createdAt: undefined,
                createdBy: undefined,
            }
            req = { body: newPerson }
            const error = new Error('Firestore error')
            mockAdd.mockRejectedValue(error)

            await createPerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })
    })

    describe('updatePerson', () => {
        it('should update person successfully', async () => {
            const updateData = {
                name: 'Updated Name',
            }
            req = {
                params: { id: customerMock.id },
                body: updateData,
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...customerMock }),
            })

            await updatePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(customerMock.id)
            expect(mockUpdate).toHaveBeenCalledWith({
                ...updateData,
                updatedAt: expect.any(Object),
                updatedBy: memberAdminMock.id,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockSend).toHaveBeenCalled()
        })

        it('should return 404 when person not found', async () => {
            req = {
                params: { id: 'non-existent-id' },
                body: { name: 'Updated Name' },
            }
            mockGet.mockResolvedValue({
                exists: false,
            })

            await updatePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Person not found',
            })
        })

        it('should handle Firestore error', async () => {
            req = {
                params: { id: customerMock.id },
                body: { name: 'Updated Name' },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...customerMock }),
            })
            const error = new Error('Firestore error')
            mockUpdate.mockRejectedValue(error)

            await updatePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })

        it('should require admin role to update member roles', async () => {
            const updateData = {
                roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
            }
            req = {
                params: { id: member2RolesMock.id },
                body: updateData,
            }
            res = {
                ...res,
                locals: {
                    uid: member2RolesMock.id,
                    roles: [RoleType.MEMBER],
                },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...member2RolesMock }),
            })

            await updatePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Only admin can modify roles and email for members',
            })
        })

        it('should update member roles and Firebase claims', async () => {
            const updateData = {
                roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
            }
            req = {
                params: { id: member2RolesMock.id },
                body: updateData,
            }
            res = {
                ...res,
                locals: {
                    uid: memberAdminMock.id,
                    roles: [RoleType.ADMIN],
                },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...member2RolesMock }),
            })

            const mockFirebaseAuthService = {
                updateUserCustomClaims: jest.fn().mockResolvedValue(undefined),
            }

            jest.spyOn(
                FirebaseAuthService.prototype,
                'updateUserCustomClaims'
            ).mockImplementation(mockFirebaseAuthService.updateUserCustomClaims)

            await updatePerson(req as Request, res as Response)

            expect(
                mockFirebaseAuthService.updateUserCustomClaims
            ).toHaveBeenCalledWith(member2RolesMock.userId, updateData.roles)
            expect(mockUpdate).toHaveBeenCalledWith({
                ...updateData,
                updatedAt: expect.any(Object),
                updatedBy: memberAdminMock.id,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockSend).toHaveBeenCalled()
        })

        it('should handle Firebase claims update failure', async () => {
            const updateData = {
                roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
            }
            req = {
                params: { id: member2RolesMock.id },
                body: updateData,
            }
            res = {
                ...res,
                locals: {
                    uid: memberAdminMock.id,
                    roles: [RoleType.ADMIN],
                },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...member2RolesMock }),
            })

            const mockFirebaseAuthService = {
                updateUserCustomClaims: jest
                    .fn()
                    .mockRejectedValue(
                        new Error('Firebase claims update failed')
                    ),
            }

            jest.spyOn(
                FirebaseAuthService.prototype,
                'updateUserCustomClaims'
            ).mockImplementation(mockFirebaseAuthService.updateUserCustomClaims)

            await updatePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firebase claims update failed',
            })
            expect(mockUpdate).not.toHaveBeenCalled()
        })
    })

    describe('removePerson', () => {
        it('should remove person successfully', async () => {
            req = { params: { id: customerMock.id } }
            mockGet.mockResolvedValue({
                exists: true,
            })

            await removePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(customerMock.id)
            expect(mockDelete).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockSend).toHaveBeenCalled()
        })

        it('should return 404 when person not found', async () => {
            req = { params: { id: 'non-existent-id' } }
            mockGet.mockResolvedValue({
                exists: false,
            })

            await removePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Person not found',
            })
        })

        it('should handle Firestore error', async () => {
            req = { params: { id: customerMock.id } }
            mockGet.mockResolvedValue({
                exists: true,
            })
            const error = new Error('Firestore error')
            mockDelete.mockRejectedValue(error)

            await removePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })
    })
})
