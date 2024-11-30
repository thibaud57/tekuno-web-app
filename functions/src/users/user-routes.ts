import { Application } from 'express'
import { isAuthenticated } from '../auth/authenticated'
import { isAuthorized } from '../auth/authorized'
import { TypeRole } from '../auth/type-role.enum'
import {
    create as createUser,
    all as findAllUser,
    get as findOneUser,
    remove as removeUser,
    patch as updateUser,
} from './user-controller'

export function usersRoute(app: Application) {
    // creates a new user
    app.post(
        '/users',
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        createUser
    )
    //..
    // lists all users
    app.get('/users', [
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        findAllUser,
    ])
    // get :id user
    app.get('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN], allowSameUser: true }),
        findOneUser,
    ])
    // updates :id user
    app.patch('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN], allowSameUser: true }),
        updateUser,
    ])
    // deletes :id user
    app.delete('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: [TypeRole.ADMIN] }),
        removeUser,
    ])
}
