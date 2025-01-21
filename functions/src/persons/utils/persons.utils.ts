import { PersonType } from '../enums/person-type.enum'
import { MemberEntity, PersonEntity } from '../models/person-entity.model'

export function isMember(person: PersonEntity): person is MemberEntity {
    return person.personType === PersonType.MEMBER
}
