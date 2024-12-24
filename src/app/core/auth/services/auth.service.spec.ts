import { TestBed } from '@angular/core/testing'
import { UserServiceMock } from 'app/core/user/services/user.service.mock'
import { catchError, of, tap } from 'rxjs'
import { UserService } from '../../user/services/user.service'
import { AuthService } from './auth.service'
import { FirebaseAuthWrapper } from './firebase-auth.wrapper.service'
import { FirebaseAuthWrapperMock } from './firebase-auth.wrapper.service.mock'

describe('AuthService', () => {
    let service: AuthService
    let userService: UserService
    let firebaseAuthWrapper: FirebaseAuthWrapper

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useClass: UserServiceMock },
                {
                    provide: FirebaseAuthWrapper,
                    useClass: FirebaseAuthWrapperMock,
                },
            ],
        })

        service = TestBed.inject(AuthService)
        userService = TestBed.inject(UserService)
        firebaseAuthWrapper = TestBed.inject(FirebaseAuthWrapper)

        // reset localStorage before each test
        localStorage.clear()
    })

    describe('signIn', () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123',
        }

        beforeEach(() => {
            spyOn(
                firebaseAuthWrapper,
                'signInWithEmailAndPassword'
            ).and.callThrough()
        })

        it('should call signInWithEmailAndPassword and update auth state', done => {
            service
                .signIn(credentials)
                .pipe(
                    tap(() => {
                        expect(
                            firebaseAuthWrapper.signInWithEmailAndPassword
                        ).toHaveBeenCalledWith(
                            credentials.email,
                            credentials.password
                        )
                        expect(service.isAuthenticated()()).toBeTruthy()
                        expect(service.accessToken).toBeTruthy()
                        done()
                    })
                )
                .subscribe()
        })

        it('should reject when user is already logged in', done => {
            service
                .signIn(credentials)
                .pipe(
                    tap(() => {
                        service
                            .signIn(credentials)
                            .pipe(
                                catchError(error => {
                                    expect(error.message).toBe(
                                        'User is already logged in.'
                                    )
                                    done()
                                    return of(null)
                                })
                            )
                            .subscribe()
                    })
                )
                .subscribe()
        })
    })

    describe('forgotPassword', () => {
        beforeEach(() => {
            spyOn(firebaseAuthWrapper, 'useDeviceLanguage')
            spyOn(
                firebaseAuthWrapper,
                'sendPasswordResetEmail'
            ).and.callThrough()
        })

        it('should call sendPasswordResetEmail with correct email', done => {
            const email = 'test@example.com'
            service
                .forgotPassword(email)
                .pipe(
                    tap(() => {
                        expect(
                            firebaseAuthWrapper.useDeviceLanguage
                        ).toHaveBeenCalled()
                        expect(
                            firebaseAuthWrapper.sendPasswordResetEmail
                        ).toHaveBeenCalledWith(email)
                        done()
                    })
                )
                .subscribe()
        })
    })

    describe('resetPassword', () => {
        beforeEach(() => {
            spyOn(firebaseAuthWrapper, 'useDeviceLanguage')
            spyOn(firebaseAuthWrapper, 'confirmPasswordReset').and.callThrough()
        })

        it('should call confirmPasswordReset with correct parameters', done => {
            const code = 'reset-code'
            const newPassword = 'new-password'

            service
                .resetPassword(code, newPassword)
                .pipe(
                    tap(() => {
                        expect(
                            firebaseAuthWrapper.useDeviceLanguage
                        ).toHaveBeenCalled()
                        expect(
                            firebaseAuthWrapper.confirmPasswordReset
                        ).toHaveBeenCalledWith(code, newPassword)
                        done()
                    })
                )
                .subscribe()
        })
    })

    describe('signInUsingToken', () => {
        beforeEach(() => {
            spyOn(
                firebaseAuthWrapper,
                'signInWithCustomToken'
            ).and.callThrough()
        })

        it('should return false when no token is present', done => {
            localStorage.removeItem('accessToken')

            service
                .signInUsingToken()
                .pipe(
                    tap(result => {
                        expect(result).toBeFalsy()
                        expect(
                            firebaseAuthWrapper.signInWithCustomToken
                        ).not.toHaveBeenCalled()
                        done()
                    })
                )
                .subscribe()
        })

        it('should call signInWithCustomToken when token is present', done => {
            service.accessToken = 'mock-token'

            service
                .signInUsingToken()
                .pipe(
                    tap(result => {
                        expect(result).toBeTruthy()
                        expect(
                            firebaseAuthWrapper.signInWithCustomToken
                        ).toHaveBeenCalledWith('mock-token')
                        expect(service.isAuthenticated()()).toBeTruthy()
                        done()
                    })
                )
                .subscribe()
        })
    })

    describe('signOut', () => {
        it('should clear token and update auth state', done => {
            service
                .signIn({ email: 'test@example.com', password: 'password123' })
                .pipe(
                    tap(() => {
                        service
                            .signOut()
                            .pipe(
                                tap(result => {
                                    expect(result).toBeTruthy()
                                    expect(
                                        service.isAuthenticated()()
                                    ).toBeFalsy()
                                    expect(service.accessToken).toBe('')
                                    done()
                                })
                            )
                            .subscribe()
                    })
                )
                .subscribe()
        })
    })

    describe('check', () => {
        beforeEach(() => {
            spyOn(
                firebaseAuthWrapper,
                'signInWithCustomToken'
            ).and.callThrough()
        })

        it('should return true when already authenticated', done => {
            service
                .signIn({ email: 'test@example.com', password: 'password123' })
                .pipe(
                    tap(() => {
                        service
                            .check()
                            .pipe(
                                tap(result => {
                                    expect(result).toBeTruthy()
                                    expect(
                                        firebaseAuthWrapper.signInWithCustomToken
                                    ).not.toHaveBeenCalled()
                                    done()
                                })
                            )
                            .subscribe()
                    })
                )
                .subscribe()
        })

        it('should return false when no token is present', done => {
            localStorage.removeItem('accessToken')

            service
                .check()
                .pipe(
                    tap(result => {
                        expect(result).toBeFalsy()
                        expect(
                            firebaseAuthWrapper.signInWithCustomToken
                        ).not.toHaveBeenCalled()
                        done()
                    })
                )
                .subscribe()
        })
    })
})
