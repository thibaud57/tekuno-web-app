import { Request, Response } from 'express'
import { TypeRole } from './type-role.enum'

export function isAuthorized(opts: {
    hasRole: (
        | TypeRole.ADMIN
        | TypeRole.MEMBER
        | TypeRole.DJ
        | TypeRole.COMMUNICATION
        | TypeRole.ACCOUNTANT
        | TypeRole.SECRETARY
        | TypeRole.TESTER
    )[]
    allowSameUser?: boolean
}) {
    return (req: Request, res: Response, next: () => void) => {
        const { role, uid } = res.locals
        const { id } = req.params

        if (opts.allowSameUser && id && uid === id) return next()

        if (!role) return res.status(403).send()

        if (opts.hasRole.includes(role)) return next()

        return res.status(403).send()
    }
}
