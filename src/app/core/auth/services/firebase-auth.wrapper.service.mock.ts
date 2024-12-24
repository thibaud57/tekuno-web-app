import { User, UserCredential } from '@angular/fire/auth'

const mockUser: Partial<User> = {
    uid: 'mock-uid',
    email: 'test@example.com',
    displayName: 'Mock User',
    photoURL: 'mock-photo-url',
    getIdToken: () => Promise.resolve('mock-token'),
}

const mockUserCredential: UserCredential = {
    user: mockUser as User,
    providerId: 'password',
    operationType: 'signIn',
}

export class FirebaseAuthWrapperMock {
    useDeviceLanguage(): void {}

    signInWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return Promise.resolve(mockUserCredential)
    }

    signInWithCustomToken(token: string): Promise<UserCredential> {
        return Promise.resolve(mockUserCredential)
    }

    sendPasswordResetEmail(email: string): Promise<void> {
        return Promise.resolve()
    }

    confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        return Promise.resolve()
    }
}
