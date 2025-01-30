import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RoleType } from '@backend/auth/enums/role-type.enum'
import { userAdminMock, usersMock } from '@backend/users/models/user.mock'
import { AuthService } from 'app/core/auth/services/auth.service'
import { AuthServiceMock } from 'app/core/auth/services/auth.service.mock'
import { provideIcons } from 'app/core/icons/icons.provider'
import { NotificationService } from 'app/core/services/notification.service'
import { NotificationServiceMock } from 'app/core/services/notification.service.mock'
import { TranslationService } from 'app/core/translation/translation.service'
import { TranslationServiceMock } from 'app/core/translation/translation.service.mock'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { UserService } from 'app/core/user/services/user.service'
import { UserServiceMock } from 'app/core/user/services/user.service.mock'
import { of, throwError } from 'rxjs'
import { UserSettingsComponent } from './user-settings.component'

describe('UserSettingsComponent', () => {
    let component: UserSettingsComponent
    let fixture: ComponentFixture<UserSettingsComponent>
    let userService: UserService
    let authService: AuthService
    let notificationService: NotificationService
    let translationService: TranslationService

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                UserSettingsComponent,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                getTranslocoModule(),
            ],
            providers: [
                FormBuilder,
                { provide: UserService, useClass: UserServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                {
                    provide: NotificationService,
                    useClass: NotificationServiceMock,
                },
                {
                    provide: TranslationService,
                    useClass: TranslationServiceMock,
                },
                provideHttpClient(),
                provideIcons(),
            ],
        }).compileComponents()

        userService = TestBed.inject(UserService)
        authService = TestBed.inject(AuthService)
        notificationService = TestBed.inject(NotificationService)
        translationService = TestBed.inject(TranslationService)
    })

    describe('User management', () => {
        describe('When user is admin', () => {
            beforeEach(() => {
                fixture = TestBed.createComponent(UserSettingsComponent)
                component = fixture.componentInstance
                spyOn(userService, 'hasRole').and.returnValue(true)
                fixture.detectChanges()
            })

            describe('Form', () => {
                it('should initialize form with default values', () => {
                    expect(component.form.value).toEqual({
                        email: '',
                        password: '',
                        roles: [RoleType.MEMBER],
                    })
                })

                it('should validate email format', () => {
                    const emailControl = component.form.controls.email
                    emailControl.setValue('invalid-email')
                    expect(emailControl.errors?.['email']).toBeTruthy()

                    emailControl.setValue('valid@email.com')
                    expect(emailControl.errors).toBeNull()
                })

                it('should validate required fields', () => {
                    const { email, password, roles } = component.form.controls

                    email.setValue('')
                    password.setValue('')
                    roles.setValue([])

                    expect(email.errors?.['required']).toBeTruthy()
                    expect(password.errors?.['required']).toBeTruthy()
                    expect(roles.errors?.['required']).toBeTruthy()
                })
            })

            it('should load users list on init', () => {
                fixture.detectChanges()
                expect(component.users()).toEqual(usersMock)
            })

            it('should show admin section', () => {
                const adminSection = fixture.debugElement.query(
                    By.css('.mon-equipe')
                )
                expect(adminSection).toBeTruthy()
            })

            it('should handle error when loading users fails', () => {
                const errorMessage = 'Error loading users'
                spyOn(userService, 'getUsers').and.returnValue(
                    throwError(() => ({ error: { message: errorMessage } }))
                )
                spyOn(notificationService, 'showError')

                component.ngOnInit()

                expect(notificationService.showError).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX +
                        'alertes.erreur-chargement-utilisateurs',
                    errorMessage
                )
            })

            it('should add team member successfully', () => {
                const newUser = {
                    email: 'test@example.com',
                    password: 'password123',
                    roles: [RoleType.MEMBER],
                }
                component.form.patchValue(newUser)

                spyOn(userService, 'createUser').and.returnValue(of(void 0))
                spyOn(userService, 'getUsers').and.returnValue(of([]))
                spyOn(notificationService, 'showSuccess')

                component.addTeamMember()

                expect(userService.createUser).toHaveBeenCalledWith(newUser)
                expect(notificationService.showSuccess).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX + 'alertes.membre-ajoute'
                )
                expect(component.form.value).toEqual({
                    email: '',
                    password: '',
                    roles: [RoleType.MEMBER],
                })
            })

            it('should handle error when adding team member fails', () => {
                const errorMessage = 'Error adding member'
                component.form.patchValue({
                    email: 'test@example.com',
                    password: 'password123',
                    roles: [RoleType.MEMBER],
                })

                spyOn(userService, 'createUser').and.returnValue(
                    throwError(() => ({ error: { message: errorMessage } }))
                )
                spyOn(notificationService, 'showError')

                component.addTeamMember()

                expect(notificationService.showError).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX +
                        'alertes.erreur-ajout-membre',
                    errorMessage
                )
            })

            it('should delete user successfully', () => {
                spyOn(userService, 'deleteUser').and.returnValue(of(void 0))
                spyOn(userService, 'getUsers').and.returnValue(of([]))
                spyOn(notificationService, 'showSuccess')

                component.deleteUser(userAdminMock)

                expect(userService.deleteUser).toHaveBeenCalledWith(
                    userAdminMock.id
                )
                expect(notificationService.showSuccess).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX +
                        'alertes.utilisateur-supprime'
                )
            })

            it('should handle error when deleting user fails', () => {
                const errorMessage = 'Error deleting user'
                spyOn(userService, 'deleteUser').and.returnValue(
                    throwError(() => ({ error: { message: errorMessage } }))
                )
                spyOn(notificationService, 'showError')

                component.deleteUser(userAdminMock)

                expect(notificationService.showError).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX +
                        'alertes.erreur-suppression-utilisateur',
                    errorMessage
                )
            })

            it('should update user role successfully', () => {
                const updatedUser = {
                    ...userAdminMock,
                    roles: [RoleType.ACCOUNTANT],
                }
                spyOn(userService, 'updateUser').and.returnValue(of(void 0))
                spyOn(userService, 'getUsers').and.returnValue(of([]))
                spyOn(notificationService, 'showSuccess')

                component.updateUserRole(updatedUser)

                expect(userService.updateUser).toHaveBeenCalledWith(updatedUser)
                expect(notificationService.showSuccess).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX + 'alertes.role-modifie'
                )
            })

            it('should handle error when updating user role fails', () => {
                const errorMessage = 'Error updating role'
                spyOn(userService, 'updateUser').and.returnValue(
                    throwError(() => ({ error: { message: errorMessage } }))
                )
                spyOn(notificationService, 'showError')

                component.updateUserRole(userAdminMock)

                expect(notificationService.showError).toHaveBeenCalledWith(
                    component.TRANSLATION_PREFIX +
                        'alertes.erreur-modification-role',
                    errorMessage
                )
            })
        })

        describe('When user is not admin', () => {
            beforeEach(() => {
                fixture = TestBed.createComponent(UserSettingsComponent)
                component = fixture.componentInstance
                spyOn(userService, 'hasRole').and.returnValue(false)
                fixture.detectChanges()
            })

            it('should not load users on init', () => {
                spyOn(userService, 'getUsers')
                fixture.detectChanges()
                expect(userService.getUsers).not.toHaveBeenCalled()
            })

            it('should not show admin section', () => {
                const adminSection = fixture.debugElement.query(
                    By.css('.mon-equipe')
                )
                expect(adminSection).toBeFalsy()
            })

            it('should not allow team member operations', () => {
                const addButton = fixture.debugElement.query(
                    By.css('button[mat-icon-button]')
                )
                const userCards = fixture.debugElement.queryAll(
                    By.css('app-user-card')
                )

                expect(addButton).toBeFalsy()
                expect(userCards.length).toBe(0)
            })
        })
    })
})
