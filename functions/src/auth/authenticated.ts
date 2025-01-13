import { NextFunction, Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { handleAuthError } from '../shared/utils/error.utils'

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization } = req.headers

    if (!authorization) {
        return handleAuthError(res, new Error('No authorization header'))
    }

    if (!authorization.startsWith('Bearer')) {
        return handleAuthError(res, new Error('Invalid authorization format'))
    }

    try {
        const token = authorization.split('Bearer ')[1]
        const decodedToken = await admin.auth().verifyIdToken(token)

        res.locals = {
            ...res.locals,
            uid: decodedToken.uid,
            roles: decodedToken.roles || [],
            email: decodedToken.email,
        }

        return next()
    } catch (err) {
        return handleAuthError(res, err as Error)
    }
}
