import { NextFunction, Request, Response } from 'express'
import { mapValues } from 'lodash'
import { personSchema } from '../../persons/validators/person.validator'
import { ApiError } from '../models/api-error.model'
import { handleBadRequestError } from '../utils/error.utils'

export function validatePerson(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Convertit les strings vides en undefined pour les champs optionnels
        req.body = mapValues(req.body, v => (v === '' ? undefined : v))

        const validationResult = personSchema.safeParse(req.body)

        if (!validationResult.success) {
            const error: ApiError = new Error(
                validationResult.error.errors
                    .map(err => `${err.path.join('.')}: ${err.message}`)
                    .join(', ')
            )
            return handleBadRequestError(res, error)
        }

        req.body = validationResult.data
        return next()
    } catch (err) {
        const error: ApiError = new Error('Validation error')
        return handleBadRequestError(res, error)
    }
}
