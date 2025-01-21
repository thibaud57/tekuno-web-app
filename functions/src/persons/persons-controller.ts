import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { RoleType } from '../auth/enums/role-type.enum'
import { ApiError } from '../shared/models/api-error.model'
import { handleError } from '../shared/utils/error.utils'
import { MemberEntity, PersonEntity } from './models/person-entity.model'
import { isMember } from './utils/persons.utils'

export async function findAllPerson(req: Request, res: Response) {
    try {
        const snapshot = await admin.firestore().collection('persons').get()
        const persons = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as PersonEntity[]

        return res.status(200).send(persons)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function findMemberByUserId(
    userId: string
): Promise<MemberEntity | null> {
    const snapshot = await admin
        .firestore()
        .collection('persons')
        .where('userId', '==', userId)
        .limit(1)
        .get()

    if (snapshot.empty) {
        return null
    }

    const doc = snapshot.docs[0]
    return {
        id: doc.id,
        ...doc.data(),
    } as MemberEntity
}

export async function findOnePerson(req: Request, res: Response) {
    try {
        const { id } = req.params
        const snapshot = await admin
            .firestore()
            .collection('persons')
            .doc(id)
            .get()

        if (!snapshot.exists) {
            const error: ApiError = new Error('Person not found')
            error.status = 404
            return handleError(res, error)
        }

        const person = {
            id: snapshot.id,
            ...snapshot.data(),
        } as PersonEntity

        return res.status(200).send(person)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function createPerson(req: Request, res: Response) {
    try {
        const personData: Omit<PersonEntity, 'id'> = req.body
        const { uid } = res.locals

        if (!personData.name) {
            const error: ApiError = new Error('Missing required fields')
            error.status = 400
            return handleError(res, error)
        }

        const personRef = await admin
            .firestore()
            .collection('persons')
            .add({
                ...personData,
                createdAt: Timestamp.now(),
                createdBy: uid,
            })

        return res.status(201).send({ id: personRef.id })
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function updatePerson(req: Request, res: Response) {
    try {
        const { id } = req.params
        const personData: Partial<PersonEntity> = req.body
        const { uid, roles } = res.locals

        const personRef = admin.firestore().collection('persons').doc(id)
        const person = await personRef.get()

        if (!person.exists) {
            const error: ApiError = new Error('Person not found')
            error.status = 404
            return handleError(res, error)
        }

        const existingPerson = person.data() as PersonEntity

        if (isMember(existingPerson)) {
            const memberData = personData as Partial<MemberEntity>
            if (
                memberData.roles !== undefined ||
                memberData.email !== undefined
            ) {
                if (!roles.includes(RoleType.ADMIN)) {
                    const error: ApiError = new Error(
                        'Only admin can modify roles and email for members'
                    )
                    error.status = 403
                    return handleError(res, error)
                }
            }
        }

        await personRef.update({
            ...personData,
            updatedAt: Timestamp.now(),
            updatedBy: uid,
        })

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function removePerson(req: Request, res: Response) {
    try {
        const { id } = req.params
        const personRef = admin.firestore().collection('persons').doc(id)
        const person = await personRef.get()

        if (!person.exists) {
            const error: ApiError = new Error('Person not found')
            error.status = 404
            return handleError(res, error)
        }

        await personRef.delete()

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}
