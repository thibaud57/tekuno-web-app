import { TestBed } from '@angular/core/testing'
import { UserServiceMock } from 'app/core/user/services/user.service.mock'
import { Spy } from 'jasmine-core'
import { of, throwError } from 'rxjs'
import { UserService } from '../../user/services/user.service'
import { AuthService } from './auth.service'
import { FirebaseAuthWrapper } from './firebase-auth.wrapper.service'
import {
    FirebaseAuthWrapperMock,
    firebaseUserMock,
} from './firebase-auth.wrapper.service.mock'

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
            service.signIn(credentials).subscribe(() => {
                expect(
                    firebaseAuthWrapper.signInWithEmailAndPassword
                ).toHaveBeenCalledWith(credentials.email, credentials.password)
                expect(service.isAuthenticated()()).toBeTruthy()
                expect(service.accessToken).toBeTruthy()
                done()
            })
        })

        it('should reject when user is already logged in', done => {
            service.signIn(credentials).subscribe(() => {
                service.signIn(credentials).subscribe({
                    error: error => {
                        expect(error.message).toBe('User is already logged in.')
                        done()
                    },
                })
            })
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
            service.forgotPassword(email).subscribe(() => {
                expect(firebaseAuthWrapper.useDeviceLanguage).toHaveBeenCalled()
                expect(
                    firebaseAuthWrapper.sendPasswordResetEmail
                ).toHaveBeenCalledWith(email)
                done()
            })
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

            service.resetPassword(code, newPassword).subscribe(() => {
                expect(firebaseAuthWrapper.useDeviceLanguage).toHaveBeenCalled()
                expect(
                    firebaseAuthWrapper.confirmPasswordReset
                ).toHaveBeenCalledWith(code, newPassword)
                done()
            })
        })
    })

    describe('signInUsingToken', () => {
        let getFirebaseUserSpy: Spy

        beforeEach(() => {
            getFirebaseUserSpy = spyOn(firebaseAuthWrapper, 'getFirebaseUser$')
        })

        it('should return true and update auth state when token is valid', done => {
            getFirebaseUserSpy.and.returnValue(of(firebaseUserMock))

            service.signInUsingToken().subscribe(result => {
                expect(result).toBeTruthy()
                expect(service.isAuthenticated()()).toBeTruthy()
                expect(service.accessToken).toBe('test-token')
                done()
            })
        })

        it('should return false when no user is found', done => {
            getFirebaseUserSpy.and.returnValue(of(null))

            service.signInUsingToken().subscribe(result => {
                expect(result).toBeFalsy()
                expect(service.isAuthenticated()()).toBeFalsy()
                expect(service.accessToken).toBe('')
                done()
            })
        })

        it('should return false when token retrieval fails', done => {
            getFirebaseUserSpy.and.returnValue(
                throwError(() => new Error('Token error'))
            )

            service.signInUsingToken().subscribe(result => {
                expect(result).toBeFalsy()
                expect(service.isAuthenticated()()).toBeFalsy()
                expect(service.accessToken).toBe('')
                done()
            })
        })
    })

    describe('signOut', () => {
        beforeEach(() => {
            spyOn(firebaseAuthWrapper, 'signOut').and.callThrough()
        })

        it('should clear token and update auth state', done => {
            service
                .signIn({ email: 'test@example.com', password: 'password123' })
                .subscribe(() => {
                    service.signOut().subscribe(() => {
                        expect(service.isAuthenticated()()).toBeFalsy()
                        expect(service.accessToken).toBe('')
                        done()
                    })
                })
        })
    })

    describe('check', () => {
        beforeEach(() => {
            spyOn(firebaseAuthWrapper, 'getFirebaseUser$').and.returnValue(
                of(firebaseUserMock)
            )
        })

        it('should return true when already authenticated', done => {
            service
                .signIn({ email: 'test@example.com', password: 'password123' })
                .subscribe(() => {
                    service.check().subscribe(result => {
                        expect(result).toBeTruthy()
                        expect(service.isAuthenticated()()).toBeTruthy()
                        done()
                    })
                })
        })

        it('should return false when no token is present', done => {
            localStorage.removeItem('accessToken')

            service.check().subscribe(result => {
                expect(result).toBeFalsy()
                expect(service.isAuthenticated()()).toBeFalsy()
                done()
            })
        })

        it('should attempt to sign in with token when token is present but not authenticated', done => {
            spyOn(service, 'signInUsingToken').and.returnValue(of(true))

            const validJwtToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjozNTE2MjM5MDIyfQ.mR4h_nj9YSGxjKvA-YhIa2cSGXAOoekPbV4CE7yRV4E'

            localStorage.setItem('accessToken', validJwtToken)
            service.accessToken = validJwtToken

            service.check().subscribe(() => {
                expect(service.signInUsingToken).toHaveBeenCalled()
                expect(service.accessToken).toBe(validJwtToken)
                done()
            })
        })
    })
})
