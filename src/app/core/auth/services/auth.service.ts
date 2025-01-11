import { inject, Injectable, Signal, signal } from '@angular/core'
import { User, UserCredential } from '@angular/fire/auth'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { UserService } from 'app/core/user/services/user.service'
import {
    catchError,
    from,
    map,
    Observable,
    of,
    switchMap,
    throwError,
} from 'rxjs'
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
                this.userService.user.set({
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                    avatar: userCredential.user.photoURL,
                })
            })
            .catch(error => {
                this.authenticated.set(false)
                this.userService.user.set(null)
                console.error(error)
                throw error
            })

        return from(promise)
    }

    signInUsingToken(): Observable<boolean> {
        return this.firebaseAuthWrapper.getFirebaseUser$().pipe(
            switchMap((user: User | null) => {
                if (!user) {
                    this.authenticated.set(false)
                    this.userService.user.set(null)
                    return of(false)
                }

                return from(user.getIdToken()).pipe(
                    map(token => {
                        this.accessToken = token
                        this.authenticated.set(true)
                        this.userService.user.set({
                            id: user.uid,
                            name: user.displayName,
                            email: user.email,
                            avatar: user.photoURL,
                        })
                        return true
                    }),
                    catchError(error => {
                        this.authenticated.set(false)
                        this.userService.user.set(null)
                        console.error(error)
                        return of(false)
                    })
                )
            }),
            catchError(error => {
                this.authenticated.set(false)
                this.userService.user.set(null)
                console.error(error)
                return of(false)
            })
        )
    }

    signOut(): Observable<void> {
        const promise = this.firebaseAuthWrapper
            .signOut()
            .then(() => {
                localStorage.removeItem('accessToken')
                this.authenticated.set(false)
                this.userService.user.set(null)
            })
            .catch(error => {
                console.error(error)
                throw error
            })

        return from(promise)
    }

    check(): Observable<boolean> {
        console.log('check', this.authenticated())
        if (this.authenticated()) {
            return of(true)
        }
        console.log('aaa', this.accessToken)
        console.log('aaa', AuthUtils.isTokenExpired(this.accessToken))

        if (!this.accessToken || AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false)
        }
        console.log('bbb', this.accessToken)

        return this.signInUsingToken()
    }
}
