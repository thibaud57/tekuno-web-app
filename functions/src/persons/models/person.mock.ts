import { RoleType } from '../../auth/enums/role-type.enum'
import { USER_2_ROLES_UID, USER_ADMIN_UID } from '../../users/models/user.mock'
import { CorrespondentType } from '../enums/correspodent-type.enum'
import { OrganizationType } from '../enums/organization-type.enum'
import { PersonType } from '../enums/person-type.enum'
import { addressMock } from './address.mock'
import { bankDetailsIbanMock } from './bank-details.mock'
import {
    Correspondent,
    Customer,
    Dj,
    Member,
    Organization,
} from './person.model'
import { socialMediaDjMock, socialMediaMock } from './social-media.mock'

export const MEMBER_ADMIN_ID = 'member-admin-123'
export const MEMBER_2_ROLES_ID = 'member-user-456'
export const ORGA_TEKUNO_ID = 'orga-tekuno-123'
export const ORGA_AEROGARE_ID = 'orga-aerogare-123'
export const ORGA_RAW_ID = 'orga-raw-123'
export const CORRESPONDENT_KEVIN_ID = 'correspondent-kevin-123'

export const memberAdminMock: Member = {
    id: MEMBER_ADMIN_ID,
    personType: PersonType.MEMBER,
    name: 'Doe',
    firstName: 'John',
    email: 'john@mail.fr',
    roles: [RoleType.ADMIN],
    userId: USER_ADMIN_UID,
    organizationId: ORGA_TEKUNO_ID,
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
    organizationId: ORGA_TEKUNO_ID,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const membersMock: Member[] = [memberAdminMock, member2RolesMock]

export const djMock: Dj = {
    id: 'dj-carl-cox-123',
    personType: PersonType.DJ,
    name: 'Cox',
    firstName: 'Carl',
    alias: 'Carl Cox',
    email: 'carl@intec.com',
    phone: '+44123456789',
    address: addressMock,
    socialMedia: socialMediaDjMock,
    biography:
        'Oh yes, oh yes! Legendary techno DJ and producer with over 30 years of experience.',
    price: 5000,
    agencyId: ORGA_RAW_ID,
    bankDetails: bankDetailsIbanMock,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const orgaAerogareMock: Organization = {
    id: ORGA_AEROGARE_ID,
    personType: PersonType.ORGANIZATION,
    organizationType: OrganizationType.LOCATION,
    name: 'Aerogare',
    email: 'contact@aerogare.fr',
    address: addressMock,
    socialMedia: socialMediaMock,
    description: 'Lieu culturel et festif',
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const orgaTekunoMock: Organization = {
    id: ORGA_TEKUNO_ID,
    personType: PersonType.ORGANIZATION,
    organizationType: OrganizationType.ASSOCIATION,
    name: 'Tekuno',
    email: 'contact@tekuno.fr',
    address: addressMock,
    socialMedia: socialMediaMock,
    description: 'Association de promotion de la culture électronique',
    correspondentIds: [CORRESPONDENT_KEVIN_ID],
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const orgaRawMock: Organization = {
    id: ORGA_RAW_ID,
    personType: PersonType.ORGANIZATION,
    organizationType: OrganizationType.AGENCY,
    name: 'Raw',
    email: 'booking@raw-agency.com',
    address: addressMock,
    socialMedia: socialMediaMock,
    description: 'Agence de booking électronique',
    bankDetails: bankDetailsIbanMock,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const correspondentKevinMock: Correspondent = {
    id: CORRESPONDENT_KEVIN_ID,
    personType: PersonType.CORRESPONDENT,
    organizationId: ORGA_AEROGARE_ID,
    correspondentType: CorrespondentType.EVENT_COORDINATOR,
    name: 'Kevin',
    email: 'kevin@aerogare.fr',
    phone: '+33612345678',
    isActive: true,
    isDefault: true,
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}

export const customerMock: Customer = {
    id: 'person-789',
    personType: PersonType.CUSTOMER,
    name: 'Smith',
    firstName: 'Alice',
    email: 'alice@mail.fr',
    createdAt: new Date(),
    createdBy: USER_ADMIN_UID,
}
