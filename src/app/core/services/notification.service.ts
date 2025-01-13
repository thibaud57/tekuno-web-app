import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslationService } from '../translation/translation.service'

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly snackBar = inject(MatSnackBar)
    private readonly translationService = inject(TranslationService)

    showSuccess(messageKey: string): void {
        this.snackBar.open(
            this.translationService.getTranslation(messageKey),
            this.translationService.getTranslation('common.ok'),
            {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: 'success-snackbar',
            }
        )
    }

    showError(messageKey: string, errorMessage?: string): void {
        console.log('Error:', errorMessage)
        const message = errorMessage
            ? this.translationService
                  .getTranslation(messageKey)
                  .replace('{erreur}', errorMessage)
            : this.translationService.getTranslation(messageKey)

        this.snackBar.open(
            message,
            this.translationService.getTranslation('common.ok'),
            {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: 'error-snackbar',
            }
        )
    }
}
