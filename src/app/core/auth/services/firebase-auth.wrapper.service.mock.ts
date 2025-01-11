import { User, UserCredential } from '@angular/fire/auth'
import { Observable, of } from 'rxjs'

export const firebaseUserMock: User = {
    uid: 'mock-uid',
    email: 'test@example.com',
    displayName: 'Mock User',
    photoURL: 'mock-photo-url',
    emailVerified: true,
    isAnonymous: false,
    metadata: { creationTime: '', lastSignInTime: '' },
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('test-token'),
    getIdTokenResult: () =>
        Promise.resolve({
            token: 'test-token',
            signInProvider: null,
            signInSecondFactor: null,
            claims: {},
            authTime: '',
            issuedAtTime: '',
            expirationTime: '',
        }),
    reload: () => Promise.resolve(),
    toJSON: () => ({ uid: 'mock-uid' }),
    phoneNumber: null,
    providerId: 'firebase',
}

const mockUserCredential: UserCredential = {
    user: firebaseUserMock,
    providerId: 'password',
    operationType: 'signIn',
}

export class FirebaseAuthWrapperMock {
    useDeviceLanguage(): void {}

    getFirebaseUser$(): Observable<User | null> {
        return of(firebaseUserMock)
    }

    signInWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return Promise.resolve(mockUserCredential)
    }

    sendPasswordResetEmail(email: string): Promise<void> {
        return Promise.resolve()
    }

    confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        return Promise.resolve()
    }

    signOut(): Promise<void> {
        return Promise.resolve()
    }
}
