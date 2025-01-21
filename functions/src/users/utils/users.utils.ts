import { UserRecord } from 'firebase-admin/auth'
import { MemberEntity } from '../../persons/models/person-entity.model'
import { UserEntity } from '../models/user-entity.model'

export function mapUser(
    user: UserRecord,
    member?: MemberEntity | null
): UserEntity {
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
