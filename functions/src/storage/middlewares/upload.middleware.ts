import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../../shared/models/api-error.model'
import {
    handleBadRequestError,
    handleError,
} from '../../shared/utils/error.utils'

export interface RequestWithRawBody extends Request {
    rawBody?: Buffer
}

export function validateUpload(
    req: RequestWithRawBody,
    res: Response,
    next: NextFunction
) {
    try {
        if (req.is('multipart/form-data') !== 'multipart/form-data') {
            const error: ApiError = new Error(
                'Invalid content type. Expected multipart/form-data'
            )
            return handleBadRequestError(res, error)
        }

        if (!req.rawBody) {
            const error: ApiError = new Error('No raw body in request')
            return handleBadRequestError(res, error)
        }

        return next()
    } catch (error) {
        return handleError(res, error as Error)
    }
}
