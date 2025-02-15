import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { PersonFilters } from '@backend/persons/models/person/person-filter.model'
import { Person } from '@backend/persons/models/person/person.model'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PersonService {
    private readonly http = inject(HttpClient)

    private readonly apiUrl = environment.apiBaseUrl + '/persons'

    getPersons(filters?: PersonFilters): Observable<Person[]> {
        const params = Object.entries(filters ?? {}).reduce(
            (acc, [key, value]) => (value ? acc.set(key, value) : acc),
            new HttpParams()
        )

        return this.http.get<Person[]>(this.apiUrl, { params })
    }

    getPerson(id: string): Observable<Person> {
        return this.http.get<Person>(`${this.apiUrl}/${id}`)
    }

    createPerson(person: Omit<Person, 'id'>): Observable<void> {
        return this.http.post<void>(this.apiUrl, person)
    }

    updatePerson(person: Person): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${person.id}`, person)
    }

    deletePerson(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}
