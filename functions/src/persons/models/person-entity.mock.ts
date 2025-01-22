import { RoleType } from '../../auth/enums/role-type.enum'
import {
    USER_ENTITY_2_ROLES_UID,
    USER_ENTITY_ADMIN_UID,
} from '../../users/models/user-entity.mock'
import { PersonType } from '../enums/person-type.enum'
import { MemberEntity, PersonEntity } from './person-entity.model'

export const MEMBER_ENTITY_ADMIN_UID = 'member-admin-123'
export const MEMBER_ENTITY_2_ROLES_UID = 'member-user-456'

export const memberEntityAdminMock: MemberEntity = {
    id: MEMBER_ENTITY_ADMIN_UID,
    personType: PersonType.MEMBER,
    name: 'Doe',
    firstName: 'John',
    email: 'john@mail.fr',
    roles: [RoleType.ADMIN],
    userId: USER_ENTITY_ADMIN_UID,
    createdAt: new Date(),
    createdBy: USER_ENTITY_ADMIN_UID,
}

export const memberEntity2RolesMock: MemberEntity = {
    id: MEMBER_ENTITY_2_ROLES_UID,
    personType: PersonType.MEMBER,
    name: 'Watson',
    firstName: 'Emma',
    email: 'emma@mail.fr',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
    userId: USER_ENTITY_2_ROLES_UID,
    createdAt: new Date(),
    createdBy: USER_ENTITY_ADMIN_UID,
}

export const memberEntitiesMock: MemberEntity[] = [
    memberEntityAdminMock,
    memberEntity2RolesMock,
]

export const personEntityMock: PersonEntity = {
    id: 'person-789',
    personType: PersonType.DJ,
    name: 'Smith',
    firstName: 'Alice',
    email: 'alice@mail.fr',
    createdAt: new Date(),
    createdBy: USER_ENTITY_ADMIN_UID,
}
