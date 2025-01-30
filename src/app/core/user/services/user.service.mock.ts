import { signal } from '@angular/core'
import { RoleType } from '@backend/auth/enums/role-type.enum'
import { userAdminMock, usersMock } from '@backend/users/models/user.mock'
import { CreateUserDto, User } from '@backend/users/models/user.model'
import { Observable, of } from 'rxjs'

export class UserServiceMock {
    readonly user = signal<User | null>(null)

    getUsers(): Observable<User[]> {
        return of(usersMock)
    }

    getUser(id: string): Observable<User> {
        return of(userAdminMock)
    }

    hasRole(role: RoleType): boolean {
        return this.user()?.roles.includes(role) ?? false
    }

    createUser(user: CreateUserDto): Observable<void> {
        return of(void 0)
    }

    updateUser(user: User): Observable<void> {
        return of(void 0)
    }

    deleteUser(id: string): Observable<void> {
        return of(void 0)
    }
}
