import { Application } from 'express'
import { RoleType } from '../auth/enums/role-type.enum'
import { isAuthenticated } from '../auth/middlewares/authenticated.middleware'
import { isAuthorized } from '../auth/middlewares/authorized.middleware'
import { validatePerson } from '../shared/middlewares/validation.middleware'
import {
    createPerson,
    findAllPerson,
    findOnePerson,
    removePerson,
    updatePerson,
} from './persons.controller'

export function personsRoute(app: Application) {
    app.get(
        '/persons',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.MEMBER] }),
        findAllPerson
    )
    app.get(
        '/persons/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.MEMBER] }),
        findOnePerson
    )
    app.post(
        '/persons',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.SECRETARY] }),
        validatePerson,
        createPerson
    )
    app.patch(
        '/persons/:id',
        isAuthenticated,
        isAuthorized({
            hasRole: [RoleType.SECRETARY],
            allowSameUser: true,
        }),
        validatePerson,
        updatePerson
    )
    app.delete(
        '/persons/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.SECRETARY] }),
        removePerson
    )
}
