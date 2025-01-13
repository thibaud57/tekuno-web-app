import { signal } from '@angular/core'
import { Observable, of } from 'rxjs'
import { TypeRole } from '../enums/type-role.enum'
import { userAdminMock, usersMock } from '../models/user.mock'
import { CreateUser, User } from '../models/user.model'

export class UserServiceMock {
    readonly user = signal<User | null>(null)

    getUsers(): Observable<User[]> {
        return of(usersMock)
    }

    getUser(id: string): Observable<User> {
        return of(userAdminMock)
    }

    hasRole(role: TypeRole): boolean {
        return this.user()?.roles.includes(role) ?? false
    }

    createUser(user: CreateUser): Observable<void> {
        return of(void 0)
    }

    updateUser(user: User): Observable<void> {
        return of(void 0)
    }

    deleteUser(id: string): Observable<void> {
        return of(void 0)
    }
}
