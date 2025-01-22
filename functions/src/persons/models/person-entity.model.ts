import { RoleType } from '../../auth/enums/role-type.enum'
import { BaseModel } from '../../shared/models/base.model'
import { PersonType } from '../enums/person-type.enum'

export interface PersonEntity extends BaseModel {
    id: string
    personType: PersonType
    name: string
    firstName?: string
    email?: string
    profilePicture?: string
}

export interface MemberEntity extends PersonEntity {
    personType: PersonType.MEMBER
    roles: RoleType[]
    userId?: string
}
