import * as admin from 'firebase-admin'
import { PersonType } from '../enums/person-type.enum'
import { Member, Person } from '../models/person.model'

export function isMember(person: Person): person is Member {
    return person.personType === PersonType.MEMBER
}

export async function updateUserCustomClaims(userId: string, roles: string[]) {
    try {
        await admin.auth().setCustomUserClaims(userId, { roles })
    } catch (error) {
        console.error('Error updating custom claims:', error)
        throw error
    }
}
