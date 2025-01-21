import { NextFunction, Request, Response } from 'express'
import { isAuthenticated } from './authenticated'
import { isAuthorized } from './authorized'
import { RoleType } from './enums/role-type.enum'

const mockVerifyIdToken = jest.fn()
jest.mock('firebase-admin', () => ({
    auth: jest.fn(() => ({
        verifyIdToken: mockVerifyIdToken,
    })),
}))

describe('Auth Middlewares', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let nextFunction: NextFunction
    const mockSend = jest.fn()
    const mockStatus = jest.fn()

    beforeEach(() => {
        mockRequest = {
            headers: {},
            params: {},
        }
        mockResponse = {
            locals: {},
            status: mockStatus.mockReturnThis(),
            send: mockSend,
        }
        nextFunction = jest.fn()
        jest.clearAllMocks()
    })

    describe('isAuthenticated', () => {
        it('should pass with valid token', async () => {
            const mockDecodedToken = {
                uid: 'test-uid',
                email: 'test@test.com',
                roles: [RoleType.MEMBER],
            }

            mockRequest.headers = {
                authorization: 'Bearer valid-token',
            }
            mockVerifyIdToken.mockResolvedValue(mockDecodedToken)

            await isAuthenticated(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-token')
            expect(mockResponse.locals).toEqual({
                uid: mockDecodedToken.uid,
                email: mockDecodedToken.email,
                roles: mockDecodedToken.roles,
            })
            expect(nextFunction).toHaveBeenCalled()
        })

        it('should fail without authorization header', async () => {
            await isAuthenticated(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'No authorization header',
            })
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should fail with invalid authorization format', async () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat token',
            }

            await isAuthenticated(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Invalid authorization format',
            })
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should fail with invalid token', async () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid-token',
            }
            const error = new Error('Invalid token')
            mockVerifyIdToken.mockRejectedValue(error)

            await isAuthenticated(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockSend).toHaveBeenCalledWith({ message: 'Invalid token' })
            expect(nextFunction).not.toHaveBeenCalled()
        })
    })

    describe('isAuthorized', () => {
        it('should pass with required role', () => {
            mockResponse.locals = {
                roles: [RoleType.ADMIN],
            }

            const middleware = isAuthorized({ hasRole: [RoleType.ADMIN] })
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
        })

        it('should pass with allowSameUser and matching id', () => {
            mockResponse.locals = {
                uid: 'user-123',
                roles: [RoleType.MEMBER],
            }
            mockRequest.params = {
                id: 'user-123',
            }

            const middleware = isAuthorized({
                hasRole: [RoleType.ADMIN],
                allowSameUser: true,
            })
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
        })

        it('should fail without required role', () => {
            mockResponse.locals = {
                roles: [RoleType.MEMBER],
            }

            const middleware = isAuthorized({ hasRole: [RoleType.ADMIN] })
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({
                message: 'Insufficient permissions',
            })
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should fail with invalid roles format', () => {
            mockResponse.locals = {
                roles: 'INVALID_FORMAT',
            }

            const middleware = isAuthorized({ hasRole: [RoleType.ADMIN] })
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({ message: 'Invalid roles' })
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should fail with missing roles', () => {
            mockResponse.locals = {}

            const middleware = isAuthorized({ hasRole: [RoleType.ADMIN] })
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(403)
            expect(mockSend).toHaveBeenCalledWith({ message: 'Invalid roles' })
            expect(nextFunction).not.toHaveBeenCalled()
        })
    })
})
