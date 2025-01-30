import { RoleType } from '../../auth/enums/role-type.enum'
import { BaseModel } from '../../shared/models/base.model'
import { CorrespondentType } from '../enums/correspodent-type.enum'
import { Gender } from '../enums/gender.enum'
import { OrganizationType } from '../enums/organization-type.enum'
import { PersonType } from '../enums/person-type.enum'
import { Address } from './address.model'
import { BankDetails } from './bank-details.model'
import { SocialMedia, SocialMediaDj } from './social-media.model'

// Abstract
interface BasePerson extends BaseModel {
    id: string
    personType: PersonType
    name: string
    firstName?: string
    gender?: Gender
    address?: Address
    email?: string
    phone?: string
    socialMedia?: SocialMedia
    profilePicture?: string
    description?: string
    equipments?: string[]
}

export type Person = Member | Dj | Organization | Correspondent | Customer

export interface Member extends BasePerson {
    personType: PersonType.MEMBER
    organizationId?: string
    roles: RoleType[]
    userId?: string
}

export interface Dj extends BasePerson {
    personType: PersonType.DJ
    socialMedia: SocialMediaDj
    alias: string
    biography?: string
    logo?: string
    eventIds?: string[]
    price?: number
    agencyId?: string
    bankDetails?: BankDetails
    siret?: number
    vat?: string
}

export interface Organization extends BasePerson {
    personType: PersonType.ORGANIZATION
    organizationType: OrganizationType
    logo?: string
    correspondentIds?: string[]
    bankDetails?: BankDetails
    siret?: number
    vat?: string
}

export interface Correspondent extends BasePerson {
    personType: PersonType.CORRESPONDENT
    organizationId: string
    correspondentType: CorrespondentType
    isActive: boolean
    isDefault: boolean
}

export interface Customer extends BasePerson {
    personType: PersonType.CUSTOMER
    purchaseIds?: string[]
}
