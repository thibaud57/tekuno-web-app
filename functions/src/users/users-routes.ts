import { Application } from 'express'
import { RoleType } from '../auth/enums/role-type.enum'
import { isAuthenticated } from '../auth/middlewares/authenticated.middleware'
import { isAuthorized } from '../auth/middlewares/authorized.middleware'
import {
    createUser,
    findAllUser,
    findOneUser,
    removeUser,
    updateUser,
} from './users-controller'

export function usersRoute(app: Application) {
    app.get(
        '/users',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.ADMIN] }),
        findAllUser
    )
    app.get(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.ADMIN], allowSameUser: true }),
        findOneUser
    )
    app.post(
        '/users',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.ADMIN] }),
        createUser
    )
    app.patch(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.ADMIN], allowSameUser: true }),
        updateUser
    )
    app.delete(
        '/users/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.ADMIN] }),
        removeUser
    )
}
