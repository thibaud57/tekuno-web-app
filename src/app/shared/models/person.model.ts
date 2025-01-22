import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { PersonType } from '../../../../functions/src/persons/enums/person-type.enum'
import { BaseModel } from '../../../../functions/src/shared/models/base.model'

export interface Person extends BaseModel {
    id: string
    personType: PersonType
    name: string
    firstName?: string
    email?: string
    profilePicture?: string
}

export interface Member extends Person {
    // todo add organizationId with TekunoId
    personType: PersonType.MEMBER
    roles: TypeRole[]
    userId?: string
}
