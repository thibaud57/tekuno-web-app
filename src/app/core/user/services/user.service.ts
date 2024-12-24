import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { User } from 'app/core/user/user.types'
import { environment } from 'environments/environment'
import { Observable, ReplaySubject, map, tap } from 'rxjs'
import { TypeRole } from '../enums/type-role.enum'

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = environment.apiBaseUrl + '/users'

    private _user: ReplaySubject<User> = new ReplaySubject<User>(1)
    private roles: TypeRole[] = []

    private httpClient = inject(HttpClient)

    set user(value: User) {
        this._user.next(value)
    }

    get user$(): Observable<User> {
        return this._user.asObservable()
    }

    hasRole(role: TypeRole): boolean {
        return this.roles.includes(role)
    }

    getAllUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.apiUrl)
    }

    getOneUser(id: string): Observable<User> {
        return this.httpClient.get<User>(`${this.apiUrl}/${id}`).pipe(
            tap(user => {
                this._user.next(user)
            })
        )
    }

    createUser(user: User): Observable<void> {
        return this.httpClient.post<void>(this.apiUrl, user)
    }

    updateUser(user: User): Observable<void> {
        return this.httpClient
            .patch<User>(`${this.apiUrl}/update/${user.id}`, user)
            .pipe(
                map(response => {
                    this._user.next(response)
                })
            )
    }

    deleteUser(user: User): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/delete/${user.id}`)
    }
}
