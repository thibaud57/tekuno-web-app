import { OrganizationType } from '../../enums/organization-type.enum'
import { PersonType } from '../../enums/person-type.enum'

export interface PersonFilters {
    userId?: string
    personType?: PersonType
    organizationType?: OrganizationType
}
