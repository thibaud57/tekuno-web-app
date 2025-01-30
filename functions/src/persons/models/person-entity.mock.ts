import { RoleType } from '../../auth/enums/role-type.enum'
import { USER_2_ROLES_UID, USER_ADMIN_UID } from '../../users/models/user.mock'
import { PersonType } from '../enums/person-type.enum'
import { Member, Person } from './person.model'

export const MEMBER_ADMIN_ID = 'member-admin-123'
export const MEMBER_2_ROLES_ID = 'member-user-456'

export const memberAdminMock: Member = {
    id: MEMBER_ADMIN_ID,
    personType: PersonType.MEMBER,
    name: 'Doe',
    firstName: 'John',
    email: 'john@mail.fr',
    roles: [RoleType.ADMIN],
    userId: USER_ADMIN_UID,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const member2RolesMock: Member = {
    id: MEMBER_2_ROLES_ID,
    personType: PersonType.MEMBER,
    name: 'Watson',
    firstName: 'Emma',
    email: 'emma@mail.fr',
    roles: [RoleType.MEMBER, RoleType.ACCOUNTANT],
    userId: USER_2_ROLES_UID,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const memberMock: Member[] = [memberAdminMock, member2RolesMock]

export const personMock: Person = {
    id: 'person-789',
    personType: PersonType.CUSTOMER,
    name: 'Smith',
    firstName: 'Alice',
    email: 'alice@mail.fr',
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}
