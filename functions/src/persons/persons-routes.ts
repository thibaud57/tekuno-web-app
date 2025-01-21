import { Application } from 'express'
import { isAuthenticated } from '../auth/authenticated'
import { isAuthorized } from '../auth/authorized'
import { RoleType } from '../auth/enums/role-type.enum'
import {
    createPerson,
    findAllPerson,
    findOnePerson,
    removePerson,
    updatePerson,
} from './persons-controller'

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
        createPerson
    )
    app.patch(
        '/persons/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.SECRETARY] }),
        updatePerson
    )
    app.delete(
        '/persons/:id',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.SECRETARY] }),
        removePerson
    )
}
