import { inject, Injectable, Signal, signal } from '@angular/core'
import {
    Auth,
    confirmPasswordReset,
    sendPasswordResetEmail,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    UserCredential,
} from '@angular/fire/auth'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { UserService } from 'app/core/user/services/user.service'
import { from, Observable, of, throwError } from 'rxjs'
import { AuthCredential } from '../models/auth-credential'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authenticated = signal(false)

    private userService = inject(UserService)
    private firebaseAuth = inject(Auth)

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
        this.firebaseAuth.useDeviceLanguage()

        const promise = sendPasswordResetEmail(this.firebaseAuth, email)
            .then(() => void 0)
            .catch(error => {
                console.error(error)
                throw error
            })

        return from(promise)
    }

    resetPassword(oobCode: string, newPassword: string): Observable<void> {
        this.firebaseAuth.useDeviceLanguage()

        const promise = confirmPasswordReset(
            this.firebaseAuth,
            oobCode,
            newPassword
        )
            .then(() => void 0)
            .catch(error => {
                console.error(error)
                throw error
            })

        return from(promise)
    }

    signIn(credentials: AuthCredential): Observable<void> {
        if (this.authenticated()) {
            return throwError(() => new Error('User is already logged in.'))
        }

        const promise = signInWithEmailAndPassword(
            this.firebaseAuth,
            credentials.email,
            credentials.password
        )
            .then((userCredential: UserCredential) => {
                userCredential.user
                    .getIdToken()
                    .then(accessToken => (this.accessToken = accessToken))
                this.authenticated.set(true)
                this.userService.user = {
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    avatar: userCredential.user.photoURL,
                }
            })
            .catch(error => {
                console.error(error)
                throw error
            })

        return from(promise)
    }

    signInUsingToken(): Observable<boolean> {
        if (!this.accessToken) {
            return of(false)
        }

        const promise = signInWithCustomToken(
            this.firebaseAuth,
            this.accessToken
        )
            .then((userCredential: UserCredential) => {
                userCredential.user
                    .getIdToken()
                    .then(accessToken => (this.accessToken = accessToken))
                this.authenticated.set(true)
                this.userService.user = {
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    avatar: userCredential.user.photoURL,
                }
                return true
            })
            .catch(error => {
                console.error(error)
                return false
            })

        return from(promise)
    }

    signOut(): Observable<boolean> {
        localStorage.removeItem('accessToken')
        this.authenticated.set(false)
        return of(true)
    }

    check(): Observable<boolean> {
        if (this.authenticated()) {
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
