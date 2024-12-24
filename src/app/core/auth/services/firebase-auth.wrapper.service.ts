import { inject, Injectable } from '@angular/core'
import {
    Auth,
    confirmPasswordReset,
    sendPasswordResetEmail,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    UserCredential,
} from '@angular/fire/auth'

@Injectable({ providedIn: 'root' })
export class FirebaseAuthWrapper {
    private auth = inject(Auth)

    useDeviceLanguage(): void {
        this.auth.useDeviceLanguage()
    }

    signInWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    signInWithCustomToken(token: string): Promise<UserCredential> {
        return signInWithCustomToken(this.auth, token)
    }

    sendPasswordResetEmail(email: string): Promise<void> {
        return sendPasswordResetEmail(this.auth, email)
    }

    confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        return confirmPasswordReset(this.auth, code, newPassword)
    }
}
