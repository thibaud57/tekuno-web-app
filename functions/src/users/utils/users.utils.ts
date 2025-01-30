import { UserRecord } from 'firebase-admin/auth'
import { Member } from '../../persons/models/person.model'
import { User } from '../models/user.model'

export function mapUser(user: UserRecord, member?: Member | null): User {
    return {
        id: user.uid,
        email: user.email ?? '',
        displayName: member
            ? `${member.firstName ?? ''} ${member.name?.toUpperCase() ?? ''}`
            : user.displayName ?? '',
        avatar: user.photoURL ?? '',
        roles: user.customClaims?.roles ?? [],
    }
}
