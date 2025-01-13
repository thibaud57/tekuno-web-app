import { TypeRole } from '../enums/type-role.enum'
import { User } from './user.model'

export const ID_USER_MOCK = 'a15s4fs5fs23f2d15fe'

export const userAdminMock: User = {
    id: 'ID_USER_MOCK',
    displayName: 'John Doe',
    email: 'john@mail.fr',
    avatar: 'https://www.google.com/avatar.png',
    roles: [TypeRole.ADMIN],
}

export const user2RolesMock: User = {
    id: 'id2sfenksnfknsf',
    displayName: 'Emma Watson',
    email: 'emma@mail.fr',
    avatar: 'https://www.google.com/avatar.png',
    roles: [TypeRole.MEMBER, TypeRole.ACCOUNTANT],
}

export const usersMock: User[] = [userAdminMock, user2RolesMock]
