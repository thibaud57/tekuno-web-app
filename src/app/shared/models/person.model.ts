import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { PersonType } from '../../../../functions/src/persons/enums/person-type.enum'
import { BaseModel } from '../../../../functions/src/shared/models/base.model'

export interface Person extends BaseModel {
    id: string
    personType: PersonType
    nom: string
    prenom?: string
    email?: string
}

export interface Member extends Person {
    // todo add organizationId with TekunoId
    roles: TypeRole[]
    isUser: boolean
}
