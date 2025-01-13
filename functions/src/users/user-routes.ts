import { Application } from 'express'
import { isAuthenticated } from '../auth/authenticated'
import { isAuthorized } from '../auth/authorized'
import { TypeRole } from '../auth/enums/type-role.enum'
import {
    createUser,
    findAllUser,
    findOneUser,
    removeUser,
    updateUser,
} from './user-controller'

export function usersRoute(app: Application) {
    app.get(
        '/users',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        findAllUser
    )
    app.get(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN], allowSameUser: true }),
        findOneUser
    )
    app.post(
        '/users',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        createUser
    )
    app.patch(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN], allowSameUser: true }),
        updateUser
    )
    app.delete(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        removeUser
    )
}
