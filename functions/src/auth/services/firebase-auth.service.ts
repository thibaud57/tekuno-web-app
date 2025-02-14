import * as admin from 'firebase-admin'

export class FirebaseAuthService {
    private readonly auth = admin.auth()

    async updateUserCustomClaims(userId: string, roles: string[]) {
        await this.auth.setCustomUserClaims(userId, { roles })
    }
}
