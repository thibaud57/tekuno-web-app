import { Signal, signal } from '@angular/core'
import { Observable, of } from 'rxjs'
import { AuthCredential } from '../models/auth-credential'

export class AuthServiceMock {
    private authenticated = signal(false)

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token)
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? ''
    }

    isAuthenticated(): Signal<boolean> {
        return this.authenticated.asReadonly()
    }

    forgotPassword(email: string): Observable<void> {
        return of(void 0)
    }

    resetPassword(oobCode: string, newPassword: string): Observable<void> {
        return of(void 0)
    }

    signIn(credentials: AuthCredential): Observable<void> {
        return of(void 0)
    }

    signInUsingToken(): Observable<boolean> {
        return of(true)
    }

    signOut(): Observable<boolean> {
        return of(true)
    }

    check(): Observable<boolean> {
        return of(this.authenticated())
    }
}
