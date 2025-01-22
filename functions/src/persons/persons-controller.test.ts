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
} from '../shared/mocks/firebase.mock'

jest.mock('firebase-admin', () => mockFirebaseAdmin)

import { Request, Response } from 'express'
import { RoleType } from '../auth/enums/role-type.enum'
import { PersonType } from './enums/person-type.enum'
import {
    memberEntity2RolesMock,
    memberEntityAdminMock,
    personEntityMock,
} from './models/person-entity.mock'
import {
    createPerson,
    findAllPerson,
    findMemberByUserId,
    findOnePerson,
    removePerson,
    updatePerson,
} from './persons-controller'

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
                uid: memberEntityAdminMock.id,
                roles: [RoleType.ADMIN],
            },
        }

        // Reset all mocks
        jest.clearAllMocks()
        resetFirebaseMocks()

        // Setup Firestore mocks
        setupFirestoreMocks()
    })

    describe('findAllPerson', () => {
        it('should return all persons', async () => {
            const persons = [personEntityMock, memberEntityAdminMock]
            mockGet.mockResolvedValue({
                docs: persons.map(person => ({
                    id: person.id,
                    data: () => ({ ...person }),
                })),
            })

            await findAllPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockGet).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(persons)
        })

        it('should handle Firestore error', async () => {
            const error = new Error('Firestore error')
            mockGet.mockRejectedValue(error)

            await findAllPerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })
    })

    describe('findMemberByUserId', () => {
        it('should return member when found', async () => {
            mockGet.mockResolvedValue({
                empty: false,
                docs: [
                    {
                        id: memberEntityAdminMock.id,
                        data: () => ({ ...memberEntityAdminMock }),
                    },
                ],
            })

            const result = await findMemberByUserId(
                memberEntityAdminMock.userId!
            )

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockWhere).toHaveBeenCalledWith(
                'userId',
                '==',
                memberEntityAdminMock.userId
            )
            expect(mockLimit).toHaveBeenCalledWith(1)
            expect(result).toEqual(memberEntityAdminMock)
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
            req = { params: { id: personEntityMock.id } }
            mockGet.mockResolvedValue({
                exists: true,
                id: personEntityMock.id,
                data: () => ({ ...personEntityMock }),
            })

            await findOnePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(personEntityMock.id)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(personEntityMock)
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
            req = { params: { id: personEntityMock.id } }
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
                name: 'New Person',
                personType: PersonType.MEMBER,
                email: 'new@mail.fr',
                roles: [RoleType.MEMBER],
            }
            req = { body: newPerson }
            const newId = 'new-person-id'
            mockAdd.mockResolvedValue({ id: newId })

            await createPerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockAdd).toHaveBeenCalledWith({
                ...newPerson,
                createdAt: expect.any(Object),
                createdBy: memberEntityAdminMock.id,
            })
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockSend).toHaveBeenCalledWith({ id: newId })
        })

        it('should return 400 when name is missing', async () => {
            const invalidPerson = {
                personType: PersonType.MEMBER,
                email: 'new@mail.fr',
                roles: [RoleType.MEMBER],
            }
            req = { body: invalidPerson }

            await createPerson(req as Request, res as Response)

            expect(mockAdd).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Missing required fields',
            })
        })

        it('should handle Firestore error', async () => {
            const newPerson = {
                name: 'New Person',
                personType: PersonType.MEMBER,
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
                params: { id: personEntityMock.id },
                body: updateData,
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...personEntityMock }),
            })

            await updatePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(personEntityMock.id)
            expect(mockUpdate).toHaveBeenCalledWith({
                ...updateData,
                updatedAt: expect.any(Object),
                updatedBy: memberEntityAdminMock.id,
            })
            expect(mockStatus).toHaveBeenCalledWith(204)
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

            expect(mockUpdate).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Person not found',
            })
        })

        it('should prevent non-admin from updating member roles', async () => {
            const updateData = {
                roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
            }
            req = {
                params: { id: memberEntity2RolesMock.id },
                body: updateData,
            }
            const nonAdminRes = {
                ...res,
                locals: {
                    uid: memberEntity2RolesMock.id,
                    roles: [RoleType.MEMBER],
                },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...memberEntity2RolesMock }),
            })

            await updatePerson(req as Request, nonAdminRes as Response)

            expect(mockUpdate).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Only admin can modify roles and email for members',
            })
        })

        it('should handle Firestore error', async () => {
            req = {
                params: { id: personEntityMock.id },
                body: { name: 'Updated Name' },
            }
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ ...personEntityMock }),
            })
            const error = new Error('Firestore error')
            mockUpdate.mockRejectedValue(error)

            await updatePerson(req as Request, res as Response)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Firestore error',
            })
        })
    })

    describe('removePerson', () => {
        it('should delete person successfully', async () => {
            req = { params: { id: personEntityMock.id } }
            mockGet.mockResolvedValue({
                exists: true,
            })

            await removePerson(req as Request, res as Response)

            expect(mockCollection).toHaveBeenCalledWith('persons')
            expect(mockDoc).toHaveBeenCalledWith(personEntityMock.id)
            expect(mockDelete).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(204)
        })

        it('should return 404 when person not found', async () => {
            req = { params: { id: 'non-existent-id' } }
            mockGet.mockResolvedValue({
                exists: false,
            })

            await removePerson(req as Request, res as Response)

            expect(mockDelete).not.toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Person not found',
            })
        })

        it('should handle Firestore error', async () => {
            req = { params: { id: personEntityMock.id } }
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
