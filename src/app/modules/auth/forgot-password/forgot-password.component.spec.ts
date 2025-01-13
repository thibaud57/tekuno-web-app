import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { AuthService } from 'app/core/auth/services/auth.service'
import { AuthServiceMock } from 'app/core/auth/services/auth.service.mock'
import { TranslationService } from 'app/core/translation/translation.service'
import { TranslationServiceMock } from 'app/core/translation/translation.service.mock'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { of, throwError } from 'rxjs'
import { AuthForgotPasswordComponent } from './forgot-password.component'

describe('AuthForgotPasswordComponent', () => {
    let component: AuthForgotPasswordComponent
    let fixture: ComponentFixture<AuthForgotPasswordComponent>
    let authService: AuthService
    let translationService: TranslationService

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AuthForgotPasswordComponent,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                getTranslocoModule(),
            ],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                {
                    provide: TranslationService,
                    useClass: TranslationServiceMock,
                },
                provideRouter([
                    {
                        path: 'forgot-password',
                        component: AuthForgotPasswordComponent,
                    },
                ]),
            ],
        }).compileComponents()

        fixture = TestBed.createComponent(AuthForgotPasswordComponent)
        component = fixture.componentInstance
        authService = TestBed.inject(AuthService)
        translationService = TestBed.inject(TranslationService)
        fixture.detectChanges()
    })

    describe('Form', () => {
        it('should validate email format', () => {
            component.form.controls.email.setValue('invalid-email')
            expect(component.form.controls.email.errors?.['email']).toBeTruthy()

            component.form.controls.email.setValue('valid@email.com')
            expect(component.form.controls.email.errors).toBeNull()
        })

        it('should validate required fields', () => {
            component.form.controls.email.setValue('')
            expect(
                component.form.controls.email.errors?.['required']
            ).toBeTruthy()
        })
    })

    describe('Password reset request process', () => {
        it('should show success message after successful request', () => {
            spyOn(authService, 'forgotPassword').and.returnValue(of(void 0))
            spyOn(translationService, 'getTranslation').and.returnValue(
                'Success message'
            )

            component.form.setValue({
                email: 'test@example.com',
            })

            component.sendResetLink()

            expect(authService.forgotPassword).toHaveBeenCalledWith(
                'test@example.com'
            )
            expect(component.showAlert).toBeTrue()
            expect(component.alert).toEqual({
                type: 'success',
                message: 'Success message',
            })
        })

        it('should handle request errors', () => {
            spyOn(authService, 'forgotPassword').and.returnValue(
                throwError(() => new Error())
            )
            spyOn(translationService, 'getTranslation').and.returnValue(
                'Error message'
            )

            component.form.controls.email.setValue('test@example.com')

            component.sendResetLink()

            expect(component.showAlert).toBeTrue()
            expect(component.alert).toEqual({
                type: 'error',
                message: 'Error message',
            })
        })

        it('should not call forgotPassword if form is invalid', () => {
            spyOn(authService, 'forgotPassword')

            component.form.controls.email.setValue('invalid-email')

            component.sendResetLink()

            expect(authService.forgotPassword).not.toHaveBeenCalled()
        })
    })
})
