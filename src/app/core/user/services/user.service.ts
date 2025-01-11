import { HttpClient } from '@angular/common/http'
import { Injectable, Signal, inject, signal } from '@angular/core'
import { User } from 'app/core/user/user.types'
import { environment } from 'environments/environment'
import { Observable, map, tap } from 'rxjs'
import { TypeRole } from '../enums/type-role.enum'

@Injectable({ providedIn: 'root' })
export class UserService {
    readonly user = signal<User | null>(null)

    private apiUrl = environment.apiBaseUrl + '/users'
    private roles: TypeRole[] = []

    private httpClient = inject(HttpClient)

    getUser(): Signal<User | null> {
        return this.user.asReadonly()
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
                this.user.set(user)
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
                    this.user.set(response)
                })
            )
    }

    deleteUser(user: User): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/delete/${user.id}`)
    }
}
