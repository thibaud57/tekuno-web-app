import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { CollectionReference, Query, Timestamp } from 'firebase-admin/firestore'
import { RoleType } from '../auth/enums/role-type.enum'
import { FirebaseAuthService } from '../auth/services/firebase-auth.service'
import { ApiError } from '../shared/models/api-error.model'
import { cleanData } from '../shared/utils/data.utils'
import {
    handleAuthorizationError,
    handleError,
    handleNotFoundError,
} from '../shared/utils/error.utils'
import { Member, Person } from './models/person/person.model'
import { isMember } from './utils/persons.utils'

export async function findAllPerson(req: Request, res: Response) {
    try {
        let query: CollectionReference | Query = admin
            .firestore()
            .collection('persons')

        if (req.query.personType) {
            query = query.where('personType', '==', req.query.personType)
        }

        if (req.query.organizationType) {
            query = query.where(
                'organizationType',
                '==',
                req.query.organizationType
            )
        }

        if (req.query.userId) {
            query = query.where('userId', '==', req.query.userId)
        }

        const snapshot = await query.get()
        const persons = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Person[]

        return res.status(200).send(persons)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function findMemberByUserId(
    userId: string
): Promise<Member | null> {
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
    } as Member
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
            return handleNotFoundError(res, error)
        }

        const person = {
            id: snapshot.id,
            ...snapshot.data(),
        } as Person

        return res.status(200).send(person)
    } catch (err) {
        return handleError(res, err as Error)
    }
}

export async function createPerson(req: Request, res: Response) {
    try {
        const cleanedData = cleanData<Person>(req.body)
        const { uid } = res.locals

        const personRef = await admin
            .firestore()
            .collection('persons')
            .add({
                ...cleanedData,
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
        const cleanedData = cleanData<Person>(req.body)
        const { uid, roles } = res.locals

        const personRef = admin.firestore().collection('persons').doc(id)
        const person = await personRef.get()

        if (!person.exists) {
            const error: ApiError = new Error('Person not found')
            return handleNotFoundError(res, error)
        }

        const existingPerson = person.data() as Person

        if (isMember(existingPerson)) {
            const memberData = cleanedData as Partial<Member>
            if (
                memberData.roles !== undefined ||
                memberData.email !== undefined
            ) {
                if (!roles.includes(RoleType.ADMIN)) {
                    const error: ApiError = new Error(
                        'Only admin can modify roles and email for members'
                    )
                    return handleAuthorizationError(res, error)
                }

                if (memberData.roles && existingPerson.userId) {
                    try {
                        // Attention reconnexion nécessaire lors de la modif
                        const firebaseAuthService = new FirebaseAuthService()
                        await firebaseAuthService.updateUserCustomClaims(
                            existingPerson.userId,
                            memberData.roles
                        )
                    } catch (firebaseError) {
                        return handleError(res, firebaseError as Error)
                    }
                }
            }
        }

        await personRef.update({
            ...cleanedData,
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
            return handleNotFoundError(res, error)
        }

        await personRef.delete()

        return res.status(204).send()
    } catch (err) {
        return handleError(res, err as Error)
    }
}
