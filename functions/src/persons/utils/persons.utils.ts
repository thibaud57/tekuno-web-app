import { PersonType } from '../enums/person-type.enum'
import { Member, Person } from '../models/person/person.model'

export function isMember(person: Person): person is Member {
    return person.personType === PersonType.MEMBER
}
