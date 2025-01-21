import { NextFunction, Request, Response } from 'express'
import { handleAuthorizationError } from '../shared/utils/error.utils'
import { RoleType } from './enums/role-type.enum'

export function isAuthorized(opts: {
    hasRole: RoleType[]
    allowSameUser?: boolean
}) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { roles, uid } = res.locals
        const { id } = req.params

        if (opts.allowSameUser && id && uid === id) {
            return next()
        }

        if (!roles || !Array.isArray(roles)) {
            return handleAuthorizationError(res, new Error('Invalid roles'))
        }

        const hasRequiredRole = roles.some(role => opts.hasRole.includes(role))

        if (hasRequiredRole) {
            return next()
        }

        return handleAuthorizationError(
            res,
            new Error('Insufficient permissions')
        )
    }
}
