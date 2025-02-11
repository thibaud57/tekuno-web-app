import { NextFunction, Request, Response } from 'express'
import { PersonType } from '../../persons/enums/person-type.enum'
import { addressWithoutNumberMock } from '../../persons/models/address/address.mock'
import { bankDetailsInvalidPaypalMock } from '../../persons/models/bank-details/bank-details.mock'
import { djMock, orgaTekunoMock } from '../../persons/models/person/person.mock'
import { socialMediaInvalidUrlMock } from '../../persons/models/social-media/social-media.mock'
import { validatePerson } from './validation.middleware'

describe('Validation Middleware', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let nextFunction: NextFunction
    const mockSend = jest.fn()
    const mockStatus = jest.fn()

    beforeEach(() => {
        mockRequest = {
            body: {},
        }
        mockResponse = {
            status: mockStatus.mockReturnThis(),
            send: mockSend,
        }
        nextFunction = jest.fn()
        jest.clearAllMocks()
    })

    describe('validatePerson', () => {
        it('should pass with valid DJ data', () => {
            mockRequest.body = djMock

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
            expect(mockRequest.body).toEqual(
                expect.objectContaining({
                    personType: PersonType.DJ,
                    name: djMock.name,
                    firstName: djMock.firstName,
                    gender: djMock.gender,
                })
            )
        })

        it('should pass with valid Organization data', () => {
            mockRequest.body = orgaTekunoMock

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
            expect(mockRequest.body).toEqual(
                expect.objectContaining({
                    personType: PersonType.ORGANIZATION,
                    name: orgaTekunoMock.name,
                    organizationType: orgaTekunoMock.organizationType,
                })
            )
        })

        it('should pass when organization has firstName or gender as null', () => {
            const validOrgData = {
                ...orgaTekunoMock,
                firstName: null,
                gender: null,
            }
            mockRequest.body = validOrgData

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(nextFunction).toHaveBeenCalled()
            expect(mockRequest.body).toEqual(
                expect.objectContaining({
                    personType: PersonType.ORGANIZATION,
                    firstName: null,
                    gender: null,
                })
            )
        })

        it('should fail with missing required fields', () => {
            mockRequest.body = {
                personType: PersonType.DJ,
            }

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Required'),
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should fail with invalid person type', () => {
            mockRequest.body = {
                personType: 'INVALID_TYPE',
                name: 'John Doe',
            }

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('personType'),
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should validate email format when provided', () => {
            const invalidDjData = {
                ...djMock,
                email: 'invalid-email',
            }
            mockRequest.body = invalidDjData

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Invalid email format'),
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        it('should handle validation error when empty body', () => {
            mockRequest = {}

            validatePerson(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Required'),
                })
            )
            expect(nextFunction).not.toHaveBeenCalled()
        })

        describe('Address validations', () => {
            it('should pass with address without street number', () => {
                const djWithoutStreetNumber = {
                    ...djMock,
                    address: addressWithoutNumberMock,
                }
                mockRequest.body = djWithoutStreetNumber

                validatePerson(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                )

                expect(nextFunction).toHaveBeenCalled()
                expect(mockRequest.body.address).toEqual(
                    addressWithoutNumberMock
                )
            })
        })

        describe('Social media validations', () => {
            it('should fail with invalid social media URL', () => {
                const djWithInvalidSocialMedia = {
                    ...djMock,
                    socialMedia: socialMediaInvalidUrlMock,
                }
                mockRequest.body = djWithInvalidSocialMedia

                validatePerson(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                )

                expect(mockStatus).toHaveBeenCalledWith(400)
                expect(mockSend).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: expect.stringContaining(
                            'Invalid Facebook URL'
                        ),
                    })
                )
                expect(nextFunction).not.toHaveBeenCalled()
            })
        })

        describe('Bank details validations', () => {
            it('should pass with partial bank details', () => {
                const djWithPartialBankDetails = {
                    ...djMock,
                    bankDetails: {
                        name: 'Compte Pro France',
                        iban: 'FR7630006000011234567890189',
                    },
                }
                mockRequest.body = djWithPartialBankDetails

                validatePerson(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                )

                expect(nextFunction).toHaveBeenCalled()
                expect(mockRequest.body.bankDetails).toEqual(
                    expect.objectContaining({
                        name: 'Compte Pro France',
                        iban: 'FR7630006000011234567890189',
                    })
                )
            })

            it('should fail with invalid PayPal email', () => {
                const djWithInvalidPaypal = {
                    ...djMock,
                    bankDetails: bankDetailsInvalidPaypalMock,
                }
                mockRequest.body = djWithInvalidPaypal

                validatePerson(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                )

                expect(mockStatus).toHaveBeenCalledWith(400)
                expect(mockSend).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: expect.stringContaining(
                            'Invalid PayPal email address'
                        ),
                    })
                )
                expect(nextFunction).not.toHaveBeenCalled()
            })
        })
    })
})
