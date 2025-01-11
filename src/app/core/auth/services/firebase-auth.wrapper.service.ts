import { inject, Injectable } from '@angular/core'
import {
    Auth,
    confirmPasswordReset,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    user,
    User,
    UserCredential,
} from '@angular/fire/auth'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class FirebaseAuthWrapper {
    private auth = inject(Auth)
    private user$ = user(this.auth)

    getFirebaseUser$(): Observable<User | null> {
        return this.user$
    }

    useDeviceLanguage(): void {
        this.auth.useDeviceLanguage()
    }

    signInWithEmailAndPassword(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    sendPasswordResetEmail(email: string): Promise<void> {
        return sendPasswordResetEmail(this.auth, email)
    }

    confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        return confirmPasswordReset(this.auth, code, newPassword)
    }

    signOut(): Promise<void> {
        return firebaseSignOut(this.auth)
    }
}
