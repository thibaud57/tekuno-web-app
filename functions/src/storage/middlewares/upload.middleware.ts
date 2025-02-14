import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../../shared/models/api-error.model'
import { handleError } from '../../shared/utils/error.utils'

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
            error.status = 400
            return handleError(res, error)
        }

        if (!req.rawBody) {
            const error: ApiError = new Error('No raw body in request')
            error.status = 400
            return handleError(res, error)
        }

        return next()
    } catch (error) {
        return handleError(res, error as Error)
    }
}
