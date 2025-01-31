import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { UpdateRequest } from 'firebase-admin/auth'
import { RoleType } from '../auth/enums/role-type.enum'
import { PersonType } from '../persons/enums/person-type.enum'
import { Member } from '../persons/models/person.model'
import {
    createPerson,
    findMemberByUserId,
    removePerson,
    updatePerson,
} from '../persons/persons-controller'
import { ApiError } from '../shared/models/api-error.model'
import { handleError } from '../shared/utils/error.utils'
import { CreateUserDto, User } from './models/user.model'
import { mapUser } from './utils/users.utils'

export async function findAllUser(req: Request, res: Response) {
    try {
        const users = await admin.auth().listUsers()
        const usersWithMemberData = await Promise.all(
            users.users.map(async user => {
                const member = await findMemberByUserId(user.uid)
                return mapUser(user, member)
            })
        )

        return res.status(200).send(usersWithMemberData)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function findOneUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const user = await admin.auth().getUser(id)
        const member = await findMemberByUserId(id)
        const mappedUser = mapUser(user, member)

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

        // Create Firebase user
        const { uid } = await admin.auth().createUser({
            email: createUserDto.email,
            password: createUserDto.password,
        })

        // Assign roles
        await admin
            .auth()
            .setCustomUserClaims(uid, { roles: createUserDto.roles })

        try {
            // Create associated member
            const memberData: Omit<Member, 'id'> = {
                personType: PersonType.MEMBER,
                name: 'User',
                email: createUserDto.email,
                roles: createUserDto.roles,
                userId: uid,
            }
            req.body = memberData
            await createPerson(req, res)
            return res.status(201).send()
        } catch (personError) {
            // If member creation fails, clean up the Firebase user
            await admin.auth().deleteUser(uid)
            const error: ApiError = new Error('Member creation failed')
            error.status = 500
            return handleError(res, error)
        }
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        const userEntity: User = req.body

        // Update Firebase user
        const authUpdate: Partial<UpdateRequest> = {
            displayName: userEntity.displayName,
            email: userEntity.email,
            photoURL: userEntity.avatar || null,
        }
        await admin.auth().updateUser(id, authUpdate)

        if (userEntity.roles) {
            await admin
                .auth()
                .setCustomUserClaims(id, { roles: userEntity.roles })
        }

        try {
            // Try to find and update the associated member
            const member = await findMemberByUserId(id)
            if (member) {
                const updateData: Partial<Member> = {
                    email: userEntity.email,
                    roles: userEntity.roles,
                }
                req.params = { id: member.id }
                req.body = updateData
                return updatePerson(req, res)
            } else {
                return res.status(204).send()
            }
        } catch (personError) {
            const error: ApiError = new Error(
                'Member update failed but user was updated'
            )
            error.status = 500
            return handleError(res, error)
        }
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function removeUser(req: Request, res: Response) {
    try {
        const { id } = req.params

        const userToDelete = await admin.auth().getUser(id)
        const roles = userToDelete.customClaims?.roles || []

        if (roles.includes(RoleType.ADMIN)) {
            const error: ApiError = new Error('Cannot delete admin account')
            error.status = 403
            return handleError(res, error)
        }

        try {
            // Try to find the associated member
            const member = await findMemberByUserId(id)

            // Delete the Firebase user first
            await admin.auth().deleteUser(id)

            // Then delete the member if exists
            if (member) {
                req.params = { id: member.id }
                return await removePerson(req, res)
            }

            // If no member, just return success
            return res.status(204).send()
        } catch (personError) {
            const error: ApiError = new Error('Member deletion failed')
            error.status = 500
            return handleError(res, error)
        }
    } catch (err) {
        return handleError(res, err as Error)
    }
}
