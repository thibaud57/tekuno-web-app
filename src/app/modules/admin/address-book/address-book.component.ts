import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { Person } from '@backend/persons/models/person/person.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { NotificationService } from 'app/core/services/notification.service'
import { PersonService } from 'app/modules/admin/services/person/person.service'
import { AvatarComponent } from 'app/shared/components/avatar/avatar.component'
import { GroupByLetterPipe } from 'app/shared/pipes/group-by-letter.pipe'
import { PersonFormComponent } from '../../../shared/components/person-form/person-form.component'
import { PersonDetailComponent } from './person-detail/person-detail.component'

@Component({
    selector: 'app-address-book',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        ReactiveFormsModule,
        TranslocoPipe,
        AvatarComponent,
        GroupByLetterPipe,
        PersonDetailComponent,
        PersonFormComponent,
    ],
    templateUrl: './address-book.component.html',
    styleUrl: './address-book.component.scss',
})
export class AddressBookComponent implements OnInit {
    private readonly personService = inject(PersonService)
    private readonly notificationService = inject(NotificationService)

    readonly TRANSLATION_PREFIX = 'modules.admin.address-book.'

    drawerOpened = signal<boolean>(false)
    persons = signal<Person[]>([])
    selectedPerson = signal<Person | null>(null)
    isCreating = signal<boolean>(false)
    searchControl = new FormControl('')

    ngOnInit(): void {
        this.loadPersons()
    }

    createPerson(): void {
        if (this.drawerOpened() && this.isCreating()) {
            this.drawerOpened.set(false)
            this.isCreating.set(false)
        } else {
            this.selectedPerson.set(null)
            this.isCreating.set(true)
            this.drawerOpened.set(true)
        }
    }

    togglePersonDetails(person: Person): void {
        if (this.selectedPerson()?.id === person.id) {
            this.selectedPerson.set(null)
            this.drawerOpened.set(false)
        } else {
            this.selectedPerson.set(person)
            this.isCreating.set(false)
            this.drawerOpened.set(true)
        }
    }

    closeDrawer(): void {
        this.drawerOpened.set(false)
        this.selectedPerson.set(null)
        this.isCreating.set(false)
        this.loadPersons()
    }

    private loadPersons(): void {
        this.personService.getPersons().subscribe({
            next: persons => {
                this.persons.set(persons)
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX +
                        'alertes.erreur-chargement-contacts',
                    error.error.message
                )
            },
        })
    }
}
