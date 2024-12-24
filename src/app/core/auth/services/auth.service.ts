import { inject, Injectable, Signal, signal } from '@angular/core'
import { UserCredential } from '@angular/fire/auth'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { UserService } from 'app/core/user/services/user.service'
import { from, Observable, of, throwError } from 'rxjs'
import { AuthCredential } from '../models/auth-credential'
import { FirebaseAuthWrapper } from './firebase-auth.wrapper.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authenticated = signal(false)

    private userService = inject(UserService)
    private firebaseAuthWrapper = inject(FirebaseAuthWrapper)

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
        this.firebaseAuthWrapper.useDeviceLanguage()

        const promise = this.firebaseAuthWrapper
            .sendPasswordResetEmail(email)
            .then(() => void 0)
            .catch(error => {
                console.error(error)
                throw error
            })

        return from(promise)
    }

    resetPassword(oobCode: string, newPassword: string): Observable<void> {
        this.firebaseAuthWrapper.useDeviceLanguage()

        const promise = this.firebaseAuthWrapper
            .confirmPasswordReset(oobCode, newPassword)
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

        const promise = this.firebaseAuthWrapper
            .signInWithEmailAndPassword(credentials.email, credentials.password)
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

        const promise = this.firebaseAuthWrapper
            .signInWithCustomToken(this.accessToken)
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
