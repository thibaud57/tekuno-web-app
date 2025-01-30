import { TypePerson } from '../enums/type-person.enum'
import { Person } from './person.model'

export const ID_PERSON_MOCK = 'a15s4fs5fs23f2d15fe'

export const personMemberMock: Person = {
    id: ID_PERSON_MOCK,
    name: 'Doe',
    firstName: 'John',
    personType: TypePerson.MEMBER,
    email: 'john.doe@example.com',
    profilePicture: 'https://www.google.com/avatar.png',
}

export const personMember2Mock: Person = {
    id: 'id2sfenksnfknsf',
    name: 'Watson',
    firstName: 'Emma',
    personType: TypePerson.MEMBER,
    email: 'emma@example.com',
    profilePicture: 'https://www.google.com/avatar2.png',
}

export const personsMock: Person[] = [personMemberMock, personMemberMock]
