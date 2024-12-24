import { Observable, of } from 'rxjs'
import { TypeRole } from '../enums/type-role.enum'
import { userMock, usersMock } from '../user.mock'
import { User } from '../user.types'

export class UserServiceMock {
    private roles: TypeRole[] = []

    hasRole(role: TypeRole): boolean {
        return this.roles.includes(role)
    }

    getAllUsers(): Observable<User[]> {
        return of(usersMock)
    }

    getOneUser(id: string): Observable<User> {
        return of(userMock)
    }

    createUser(user: User): Observable<void> {
        return of(void 0)
    }

    updateUser(user: User): Observable<void> {
        return of(void 0)
    }

    deleteUser(user: User): Observable<void> {
        return of(void 0)
    }
}
