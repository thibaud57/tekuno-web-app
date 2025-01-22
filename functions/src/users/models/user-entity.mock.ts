import { RoleType } from '../../auth/enums/role-type.enum'
import { CreateUserDto, UserEntity } from './user-entity.model'

export const USER_ENTITY_ADMIN_UID = 'admin-uid-123'
export const USER_ENTITY_2_ROLES_UID = 'user-uid-456'

export const createUserDtoMock: CreateUserDto = {
    email: 'emma@mail.fr',
    password: 'password123',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
}

export const userEntityAdminMock: UserEntity = {
    id: USER_ENTITY_ADMIN_UID,
    displayName: 'John DOE',
    email: 'john@mail.fr',
    avatar: '',
    roles: [RoleType.ADMIN],
}

export const userEntity2RolesMock: UserEntity = {
    id: USER_ENTITY_2_ROLES_UID,
    displayName: 'Emma WATSON',
    email: 'emma@mail.fr',
    avatar: '',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
}

export const userEntitiesMock: UserEntity[] = [
    userEntityAdminMock,
    userEntity2RolesMock,
]

export const createFirebaseUserMock = (userEntity: UserEntity) => ({
    uid: userEntity.id,
    email: userEntity.email,
    displayName: userEntity.displayName,
    photoURL: userEntity.avatar,
    customClaims: { roles: userEntity.roles },
})
