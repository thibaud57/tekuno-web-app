import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Router, provideRouter } from '@angular/router'
import { AuthService } from 'app/core/auth/services/auth.service'
import { AuthServiceMock } from 'app/core/auth/services/auth.service.mock'
import { TranslationService } from 'app/core/translation/translation.service'
import { TranslationServiceMock } from 'app/core/translation/translation.service.mock'
import { getTranslocoModule } from 'app/core/transloco/transloco-testing.module'
import { of, throwError } from 'rxjs'
import { AuthSignInComponent } from './sign-in.component'

describe('AuthSignInComponent', () => {
    let component: AuthSignInComponent
    let fixture: ComponentFixture<AuthSignInComponent>
    let authService: AuthService
    let translationService: TranslationService
    let router: Router

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AuthSignInComponent,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                getTranslocoModule(),
            ],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                {
                    provide: TranslationService,
                    useClass: TranslationServiceMock,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {},
                        },
                    },
                },
                provideRouter([
                    {
                        path: '',
                        component: AuthSignInComponent,
                    },
                ]),
            ],
        }).compileComponents()

        fixture = TestBed.createComponent(AuthSignInComponent)
        component = fixture.componentInstance
        authService = TestBed.inject(AuthService)
        translationService = TestBed.inject(TranslationService)
        router = TestBed.inject(Router)
        fixture.detectChanges()
    })

    describe('Form', () => {
        it('should have correct default values', () => {
            expect(component.form.value).toEqual({
                email: 'email@tekuno.fr',
                password: 'password',
            })
        })

        it('should validate email format', () => {
            component.form.controls.email.setValue('invalid-email')
            expect(component.form.controls.email.errors?.['email']).toBeTruthy()

            component.form.controls.email.setValue('valid@email.com')
            expect(component.form.controls.email.errors).toBeNull()
        })

        it('should validate required fields', () => {
            const { email, password } = component.form.controls

            email.setValue('')
            password.setValue('')

            expect(email.errors?.['required']).toBeTruthy()
            expect(password.errors?.['required']).toBeTruthy()
        })
    })

    describe('Sign in process', () => {
        it('should redirect after successful sign in', () => {
            spyOn(authService, 'signIn').and.returnValue(of(void 0))
            spyOn(router, 'navigateByUrl')

            component.form.setValue({
                email: 'test@example.com',
                password: 'password123',
            })

            component.signIn()

            expect(authService.signIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
            expect(router.navigateByUrl).toHaveBeenCalledWith(
                '/signed-in-redirect'
            )
        })

        it('should handle sign in errors', () => {
            spyOn(authService, 'signIn').and.returnValue(
                throwError(() => new Error())
            )
            spyOn(translationService, 'getTranslation').and.returnValue(
                'Error message'
            )

            component.form.setValue({
                email: 'test@example.com',
                password: 'wrong-password',
            })

            component.signIn()

            expect(component.showAlert).toBeTrue()
            expect(component.alert).toEqual({
                type: 'error',
                message: 'Error message',
            })
            expect(translationService.getTranslation).toHaveBeenCalledWith(
                component.TRANSLATION_PREFIX + 'email-mot-de-passe-invalide'
            )
        })

        it('should not call signIn if form is invalid', () => {
            spyOn(authService, 'signIn')

            component.form.controls.email.setValue('invalid-email')

            component.signIn()

            expect(authService.signIn).not.toHaveBeenCalled()
        })
    })
})
