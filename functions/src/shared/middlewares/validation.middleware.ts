import { NextFunction, Request, Response } from 'express'
import { personSchema } from '../../persons/validators/person.validator'
import { ApiError } from '../models/api-error.model'
import { handleError } from '../utils/error.utils'

export function validatePerson(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validationResult = personSchema.safeParse(req.body)
        console.log('Validation Result:', validationResult)

        if (!validationResult.success) {
            console.log('Validation Errors:', validationResult.error.errors)
            const error: ApiError = new Error(
                validationResult.error.errors
                    .map(err => `${err.path.join('.')}: ${err.message}`)
                    .join(', ')
            )
            error.status = 400
            return handleError(res, error)
        }

        req.body = validationResult.data
        return next()
    } catch (err) {
        console.error('Validation Error:', err)
        const error: ApiError = new Error('Validation error')
        error.status = 400
        return handleError(res, error)
    }
}
