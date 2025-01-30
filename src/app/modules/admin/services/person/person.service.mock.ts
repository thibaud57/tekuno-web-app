import {
    memberAdminMock,
    membersMock,
} from '@backend/persons/models/person.mock'
import { Person } from '@backend/persons/models/person.model'
import { Observable, of } from 'rxjs'

export class PersonServiceMock {
    getPersons(): Observable<Person[]> {
        return of(membersMock)
    }

    getPerson(id: string): Observable<Person> {
        return of(memberAdminMock)
    }

    createPerson(person: Omit<Person, 'id'>): Observable<void> {
        return of(void 0)
    }

    updatePerson(person: Person): Observable<void> {
        return of(void 0)
    }

    deletePerson(id: string): Observable<void> {
        return of(void 0)
    }
}
