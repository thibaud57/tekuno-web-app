import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { TypeRole } from '../enums/type-role.enum'
import { CreateUser, User } from '../models/user.model'

@Injectable({ providedIn: 'root' })
export class UserService {
    readonly user = signal<User | null>(null)

    private readonly apiUrl = environment.apiBaseUrl + '/users'

    private readonly http = inject(HttpClient)

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl)
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`)
    }

    hasRole(role: TypeRole): boolean {
        return this.user()?.roles.includes(role) ?? false
    }

    createUser(user: CreateUser): Observable<void> {
        return this.http.post<void>(this.apiUrl, user)
    }

    updateUser(user: User): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${user.id}`, user)
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}
