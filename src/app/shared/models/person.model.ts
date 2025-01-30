import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { BaseModel } from '../../../../functions/src/shared/models/base.model'
import { TypePerson } from '../enums/type-person.enum'

export interface Person extends BaseModel {
    id: string
    personType: TypePerson
    name: string
    firstName?: string
    email?: string
    profilePicture?: string
}

export interface Member extends Person {
    // todo add organizationId with TekunoId
    personType: TypePerson.MEMBER
    roles: TypeRole[]
    userId?: string
}
