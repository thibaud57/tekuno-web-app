import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { provideIcons } from 'app/core/icons/icons.provider'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { user2RolesMock, userAdminMock } from 'app/core/user/models/user.mock'
import { UserCardComponent } from './user-card.component'

describe('UserCardComponent', () => {
    let component: UserCardComponent
    let fixture: ComponentFixture<UserCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                UserCardComponent,
                getTranslocoModule(),
                NoopAnimationsModule,
            ],
            providers: [provideIcons(), provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(UserCardComponent)
        component = fixture.componentInstance

        component.user = userAdminMock
        fixture.detectChanges()
    })

    it('should display user information', () => {
        const name = fixture.debugElement.query(By.css('.font-medium'))
        const email = fixture.debugElement.query(By.css('.text-secondary'))

        expect(name.nativeElement.textContent).toContain(
            userAdminMock.displayName
        )
        expect(email.nativeElement.textContent).toContain(userAdminMock.email)
    })

    it('should emit roleChange event when role is changed', () => {
        const roleChangeSpy = spyOn(component.roleChange, 'emit')
        const newRoles = [TypeRole.MEMBER, TypeRole.ACCOUNTANT]

        component.form.controls.roles.setValue(newRoles)

        expect(roleChangeSpy).toHaveBeenCalledWith({
            ...userAdminMock,
            roles: newRoles,
        })
    })

    it('should emit delete event when delete button is clicked', () => {
        const deleteSpy = spyOn(component.delete, 'emit')
        const deleteButton = fixture.debugElement.query(
            By.css('button[mat-icon-button]')
        )

        if (component.showDeleteButton) {
            deleteButton.nativeElement.click()
            expect(deleteSpy).toHaveBeenCalledWith(userAdminMock)
        }
    })

    it('should not show delete button when showDeleteButton is false', () => {
        component.showDeleteButton = false
        fixture.detectChanges()

        const deleteButton = fixture.debugElement.query(
            By.css('button[mat-icon-button]')
        )
        expect(deleteButton).toBeFalsy()
    })

    it('should initialize form with user roles', () => {
        expect(component.form.get('roles')?.value).toEqual(userAdminMock.roles)
    })

    it('should display multiple roles for a user', () => {
        component.user = user2RolesMock
        fixture.detectChanges()

        const roleElements = fixture.debugElement.queryAll(
            By.css('.bg-primary\\/10')
        )
        expect(roleElements.length).toBe(user2RolesMock.roles.length)
    })
})
