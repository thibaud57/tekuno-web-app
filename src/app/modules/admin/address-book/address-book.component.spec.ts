import { HttpErrorResponse } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
    djMock,
    member2RolesMock,
    memberAdminMock,
} from '@backend/persons/models/person.mock'
import { NotificationService } from 'app/core/services/notification.service'
import { NotificationServiceMock } from 'app/core/services/notification.service.mock'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { PersonService } from 'app/modules/admin/services/person/person.service'
import { of, throwError } from 'rxjs'
import { PersonServiceMock } from '../services/person/person.service.mock'
import { AddressBookComponent } from './address-book.component'

describe('AddressBookComponent', () => {
    let component: AddressBookComponent
    let fixture: ComponentFixture<AddressBookComponent>
    let personService: PersonService
    let notificationService: NotificationService

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AddressBookComponent,
                getTranslocoModule(),
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: PersonService, useClass: PersonServiceMock },
                {
                    provide: NotificationService,
                    useClass: NotificationServiceMock,
                },
            ],
        }).compileComponents()

        fixture = TestBed.createComponent(AddressBookComponent)
        component = fixture.componentInstance
        personService = TestBed.inject(PersonService)
        notificationService = TestBed.inject(NotificationService)
    })

    describe('loadPersons', () => {
        it('should load persons successfully', () => {
            const persons = [memberAdminMock, member2RolesMock, djMock]
            spyOn(personService, 'getPersons').and.returnValue(of(persons))
            fixture.detectChanges()

            expect(component.persons()).toEqual(persons)
            expect(personService.getPersons).toHaveBeenCalled()
        })

        it('should show error notification when loading persons fails', () => {
            const error = new HttpErrorResponse({
                error: { message: 'Error loading persons' },
                status: 500,
            })
            spyOn(personService, 'getPersons').and.returnValue(
                throwError(() => error)
            )
            spyOn(notificationService, 'showError')
            fixture.detectChanges()

            expect(notificationService.showError).toHaveBeenCalledWith(
                component.TRANSLATION_PREFIX +
                    'alertes.erreur-chargement-contacts',
                'Error loading persons'
            )
        })

        it('should display no contacts message when persons list is empty', () => {
            spyOn(personService, 'getPersons').and.returnValue(of([]))
            fixture.detectChanges()

            expect(component.persons().length).toBe(0)
            const noContactsMessage = fixture.nativeElement.querySelector(
                '.no-contacts-message'
            )
            expect(noContactsMessage.textContent).toContain(
                'Aucun contact trouvé'
            )
        })
    })

    describe('togglePersonDetails', () => {
        const person = memberAdminMock

        it('should open drawer and set selected person when different person is selected', () => {
            component.togglePersonDetails(person)

            expect(component.selectedPerson()).toBe(person)
            expect(component.drawerOpened()).toBeTrue()
        })

        it('should close drawer and clear selected person when same person is selected', () => {
            component.selectedPerson.set(person)
            component.drawerOpened.set(true)

            component.togglePersonDetails(person)

            expect(component.selectedPerson()).toBeNull()
            expect(component.drawerOpened()).toBeFalse()
        })
    })
})
