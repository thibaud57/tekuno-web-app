import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { Person } from '../../../../shared/models/person.model'

@Injectable({ providedIn: 'root' })
export class PersonService {
    private readonly apiUrl = environment.apiBaseUrl + '/persons'
    private readonly http = inject(HttpClient)

    getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl)
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
