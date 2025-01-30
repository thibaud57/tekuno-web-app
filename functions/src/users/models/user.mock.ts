import { RoleType } from '../../auth/enums/role-type.enum'
import { CreateUserDto, User } from './user.model'

export const USER_ADMIN_UID = 'admin-uid-123'
export const USER_2_ROLES_UID = 'user-uid-456'

export const createUserDtoMock: CreateUserDto = {
    email: 'emma@mail.fr',
    password: 'password123',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
}

export const userAdminMock: User = {
    id: USER_ADMIN_UID,
    displayName: 'John DOE',
    email: 'john@mail.fr',
    avatar: '',
    roles: [RoleType.ADMIN],
}

export const user2RolesMock: User = {
    id: USER_2_ROLES_UID,
    displayName: 'Emma WATSON',
    email: 'emma@mail.fr',
    avatar: '',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
}

export const usersMock: User[] = [userAdminMock, user2RolesMock]

export const createFirebaseUserMock = (userEntity: User) => ({
    uid: userEntity.id,
    email: userEntity.email,
    displayName: userEntity.displayName,
    photoURL: userEntity.avatar,
    customClaims: { roles: userEntity.roles },
})
