import { UserRecord } from 'firebase-admin/auth'
import { RoleType } from '../../auth/enums/role-type.enum'
import { UserEntity } from '../models/user-entity.model'

export function mapUser(user: UserRecord): UserEntity {
    const roles = user.customClaims?.roles || ([] as RoleType[])

    return {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        avatar: user.photoURL,
        roles,
    }
}
