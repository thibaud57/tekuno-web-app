import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { apiBaseUrl } from 'app/app.config'
import { User } from 'app/core/user/user.types'
import { Observable, ReplaySubject, map, tap } from 'rxjs'
import { TypeRole } from './enums/type-role.enum'

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient)
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1)
    private roles: TypeRole[] = []
    private apiUrl = apiBaseUrl + '/users'

    set user(value: User) {
        this._user.next(value)
    }

    get user$(): Observable<User> {
        return this._user.asObservable()
    }

    hasRole(role: TypeRole): boolean {
        return this.roles.includes(role)
    }

    get(): Observable<User> {
        return this._httpClient.get<User>('api/users').pipe(
            tap(user => {
                this._user.next(user)
            })
        )
    }

    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/users', { user }).pipe(
            map(response => {
                this._user.next(response)
            })
        )
    }

    createUser(userData: any): Observable<any> {
        const headers = this.getAuthHeaders()
        return this._httpClient.post(this.apiUrl, userData, { headers })
    }

    getAllUsers(): Observable<any> {
        const headers = this.getAuthHeaders()
        return this._httpClient.get(this.apiUrl, { headers })
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken') || ''
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        })
    }
}
