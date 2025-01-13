import { Response } from 'express'
import { ApiError } from '../models/api-error.model'

export function handleError(res: Response, err: ApiError): Response {
    const status = err.status || 500
    const message = err.code ? `${err.code} - ${err.message}` : err.message

    return res.status(status).send({ message })
}

export function handleAuthError(res: Response, err: Error): Response {
    return handleError(res, {
        ...err,
        status: 401,
        message: err.message || 'Unauthorized',
    })
}

export function handleAuthorizationError(
    res: Response,
    err: ApiError
): Response {
    return handleError(res, {
        ...err,
        status: 403,
        message: err.message || 'Forbidden',
    })
}
