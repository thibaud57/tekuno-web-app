import { Application } from 'express'
import { RoleType } from '../auth/enums/role-type.enum'
import { isAuthenticated } from '../auth/middlewares/authenticated.middleware'
import { isAuthorized } from '../auth/middlewares/authorized.middleware'
import { validateUpload } from './middlewares/upload.middleware'
import { deleteFile, uploadFile } from './storage.controller'

export function storageRoute(app: Application) {
    app.post(
        '/storage/upload',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.MEMBER] }),
        validateUpload,
        uploadFile
    )
    app.post(
        '/storage/delete',
        isAuthenticated,
        isAuthorized({ hasRole: [RoleType.MEMBER] }),
        deleteFile
    )
}
