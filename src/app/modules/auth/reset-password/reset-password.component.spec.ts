import { provideHttpClient } from '@angular/common/http'
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, Router } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { AuthService } from 'app/core/auth/services/auth.service'
import { AuthServiceMock } from 'app/core/auth/services/auth.service.mock'
import { provideIcons } from 'app/core/icons/icons.provider'
import { TranslationService } from 'app/core/translation/translation.service'
import { TranslationServiceMock } from 'app/core/translation/translation.service.mock'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { of, throwError } from 'rxjs'
import { AuthResetPasswordComponent } from './reset-password.component'

describe('AuthResetPasswordComponent', () => {
    let component: AuthResetPasswordComponent
    let authService: AuthService
    let translationService: TranslationService
    let router: Router
    let harness: RouterTestingHarness

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AuthResetPasswordComponent,
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
                        path: 'reset-password',
                        component: AuthResetPasswordComponent,
                    },
                ]),
                provideHttpClient(),
                provideIcons(),
            ],
        }).compileComponents()

        harness = await RouterTestingHarness.create()
        await harness.navigateByUrl('/reset-password?oobCode=valid-code')

        component = harness.routeDebugElement.componentInstance
        authService = TestBed.inject(AuthService)
        translationService = TestBed.inject(TranslationService)
        router = TestBed.inject(Router)
    })

    describe('Form', () => {
        it('should validate password requirements', () => {
            component.form.controls.password.setValue('short')
            expect(
                component.form.controls.password.errors?.['passwordStrength']
            ).toBeTruthy()

            component.form.controls.password.setValue('ValidPassword123!')
            expect(component.form.controls.password.errors).toBeNull()
        })

        it('should validate password confirmation match', () => {
            component.form.setValue({
                password: 'ValidPassword123!',
                passwordConfirm: 'DifferentPassword123!',
            })

            expect(component.form.errors?.['mustMatch']).toBeTruthy()

            component.form.controls.passwordConfirm.setValue(
                'ValidPassword123!'
            )
            expect(component.form.errors).toBeNull()
        })

        it('should validate required fields', () => {
            component.form.setValue({
                password: '',
                passwordConfirm: '',
            })

            expect(
                component.form.controls.password.errors?.['required']
            ).toBeTruthy()
            expect(
                component.form.controls.passwordConfirm.errors?.['required']
            ).toBeTruthy()
        })
    })

    describe('Password reset process', () => {
        it('should reset password and redirect after success', fakeAsync(() => {
            spyOn(authService, 'resetPassword').and.returnValue(of(void 0))
            spyOn(router, 'navigate')
            spyOn(translationService, 'getTranslation').and.returnValue(
                'Success message'
            )

            component.form.setValue({
                password: 'NewPassword123!',
                passwordConfirm: 'NewPassword123!',
            })

            component.resetPassword()
            tick(1000)

            expect(authService.resetPassword).toHaveBeenCalledWith(
                'valid-code',
                'NewPassword123!'
            )
            expect(component.alert).toEqual({
                type: 'success',
                message: 'Success message',
            })
            expect(router.navigate).toHaveBeenCalledWith(['/sign-in'])
        }))

        it('should handle reset errors', () => {
            spyOn(authService, 'resetPassword').and.returnValue(
                throwError(() => new Error())
            )
            spyOn(translationService, 'getTranslation').and.returnValue(
                'Error message'
            )

            component.form.setValue({
                password: 'NewPassword123!',
                passwordConfirm: 'NewPassword123!',
            })

            component.resetPassword()

            expect(component.showAlert).toBeTrue()
            expect(component.alert).toEqual({
                type: 'error',
                message: 'Error message',
            })
        })

        it('should not call resetPassword if form is invalid', () => {
            spyOn(authService, 'resetPassword')

            component.form.setValue({
                password: 'short',
                passwordConfirm: 'short',
            })

            component.resetPassword()

            expect(authService.resetPassword).not.toHaveBeenCalled()
        })

        it('should not call resetPassword if oobCode is missing', async () => {
            spyOn(authService, 'resetPassword')

            await harness.navigateByUrl('/reset-password')
            component = harness.routeDebugElement.componentInstance
            component.form.setValue({
                password: 'ValidPassword123!',
                passwordConfirm: 'ValidPassword123!',
            })

            component.resetPassword()

            expect(authService.resetPassword).not.toHaveBeenCalled()
        })
    })
})
