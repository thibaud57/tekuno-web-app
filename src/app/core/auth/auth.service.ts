import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
    Auth,
    signInWithEmailAndPassword,
    UserCredential,
} from '@angular/fire/auth'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { UserService } from 'app/core/user/user.service'
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated = false
    private _httpClient = inject(HttpClient)
    private _userService = inject(UserService)
    private firebaseAuth = inject(Auth)

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token)
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? ''
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email)
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password)
    }

    signIn(credentials: { email: string; password: string }): Observable<void> {
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'))
        }

        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            credentials.email,
            credentials.password
        ).then((userCredential: UserCredential) => {
            userCredential.user
                .getIdToken()
                .then(accessToken => (this.accessToken = accessToken))
            this._authenticated = true
            this._userService.user = {
                id: userCredential.user.uid,
                name: userCredential.user.displayName,
                email: userCredential.user.email,
                avatar: userCredential.user.photoURL,
            }
        })

        return from(promise)
    }

    signInUsingToken(): Observable<any> {
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() => of(false)),
                switchMap((response: any) => {
                    if (response.accessToken) {
                        this.accessToken = response.accessToken
                    }
                    this._authenticated = true
                    this._userService.user = response.user
                    return of(true)
                })
            )
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken')
        this._authenticated = false
        return of(true)
    }

    unlockSession(credentials: {
        email: string
        password: string
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials)
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true)
        }

        if (!this.accessToken) {
            return of(false)
        }

        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false)
        }

        return this.signInUsingToken()
    }
}
