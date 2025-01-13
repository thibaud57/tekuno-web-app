import { TestBed } from '@angular/core/testing'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Spy } from 'jasmine-core'
import { TranslationService } from '../translation/translation.service'
import { TranslationServiceMock } from '../translation/translation.service.mock'
import { NotificationService } from './notification.service'

class MatSnackBarMock {
    open(): void {}
}

describe('NotificationService', () => {
    let service: NotificationService
    let snackBar: MatSnackBar
    let translationService: TranslationService
    let getTranslationSpy: Spy
    const translatedOk = 'OK'

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: MatSnackBar, useClass: MatSnackBarMock },
                {
                    provide: TranslationService,
                    useClass: TranslationServiceMock,
                },
            ],
        })

        service = TestBed.inject(NotificationService)
        snackBar = TestBed.inject(MatSnackBar)
        translationService = TestBed.inject(TranslationService)
        getTranslationSpy = spyOn(translationService, 'getTranslation')
    })

    describe('showSuccess', () => {
        it('should show success message with correct configuration', () => {
            const translatedMessage = 'Success Message'

            spyOn(snackBar, 'open')
            getTranslationSpy.and.returnValues(translatedMessage, translatedOk)

            service.showSuccess('success.message')

            expect(snackBar.open).toHaveBeenCalledWith(
                translatedMessage,
                translatedOk,
                {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: 'success-snackbar',
                }
            )
        })
    })

    describe('showError', () => {
        it('should show error message with correct configuration', () => {
            const translatedMessage = 'Error Message'

            spyOn(snackBar, 'open')
            getTranslationSpy.and.returnValues(translatedMessage, translatedOk)

            service.showError('error.message')

            expect(snackBar.open).toHaveBeenCalledWith(
                translatedMessage,
                translatedOk,
                {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: 'error-snackbar',
                }
            )
        })

        it('should show error message with error details when provided', () => {
            const translatedMessage = 'Error: {erreur}'
            const expectedMessage = 'Error: Specific error'

            spyOn(snackBar, 'open')
            getTranslationSpy.and.returnValues(translatedMessage, translatedOk)

            service.showError('error.message', 'Specific error')

            expect(snackBar.open).toHaveBeenCalledWith(
                expectedMessage,
                translatedOk,
                {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: 'error-snackbar',
                }
            )
        })
    })
})
