import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { UpdateRequest, UserRecord } from 'firebase-admin/auth'
import { TypeRole } from '../auth/enums/type-role.enum'
import { ApiError } from '../shared/models/api-error.model'
import { handleError } from '../shared/utils/error.utils'
import { CreateUserDto, UserEntity } from './models/user.model'

export async function findAllUser(req: Request, res: Response) {
    try {
        const users = await admin.auth().listUsers()
        const mappedUsers = users.users.map(mapUser)

        return res.status(200).send(mappedUsers)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function findOneUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const user = await admin.auth().getUser(id)
        const mappedUser = mapUser(user)

        return res.status(200).send(mappedUser)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const createUserDto: CreateUserDto = req.body

        if (
            !createUserDto.email ||
            !createUserDto.password ||
            createUserDto.roles.length === 0
        ) {
            const error: ApiError = new Error('Missing required fields')
            error.status = 400
            return handleError(res, error)
        }

        const { uid } = await admin.auth().createUser({
            email: createUserDto.email,
            password: createUserDto.password,
        })

        await admin
            .auth()
            .setCustomUserClaims(uid, { roles: createUserDto.roles })

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const userEntity: UserEntity = req.body

        const authUpdate: Partial<UpdateRequest> = {
            displayName: userEntity.displayName,
            email: userEntity.email,
            photoURL: userEntity.avatar,
        }

        await admin.auth().updateUser(id, authUpdate)

        if (userEntity.roles) {
            await admin
                .auth()
                .setCustomUserClaims(id, { roles: userEntity.roles })
        }

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function removeUser(req: Request, res: Response) {
    try {
        const { id } = req.params

        const userToDelete = await admin.auth().getUser(id)
        const roles = userToDelete.customClaims?.roles || []

        if (roles.includes(TypeRole.ADMIN)) {
            const error: ApiError = new Error('Cannot delete admin account')
            error.status = 403
            return handleError(res, error)
        }

        await admin.auth().deleteUser(id)

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}

function mapUser(user: UserRecord): UserEntity {
    const roles = user.customClaims?.roles || ([] as TypeRole[])

    return {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        avatar: user.photoURL,
        roles,
    }
}
