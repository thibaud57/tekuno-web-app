import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { Person } from '@backend/persons/models/person.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { NotificationService } from 'app/core/services/notification.service'
import { PersonService } from 'app/modules/admin/services/person/person.service'
import { AvatarComponent } from 'app/shared/components/avatar/avatar.component'
import { GroupByLetterPipe } from 'app/shared/pipes/group-by-letter.pipe'
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
    ],
    templateUrl: './address-book.component.html',
    styleUrl: './address-book.component.scss',
})
export class AddressBookComponent implements OnInit {
    readonly TRANSLATION_PREFIX = 'modules.admin.address-book.'

    drawerOpened = signal<boolean>(false)
    persons = signal<Person[]>([])
    selectedPerson = signal<Person | null>(null)
    searchControl = new FormControl('')

    private readonly personService = inject(PersonService)
    private readonly notificationService = inject(NotificationService)

    ngOnInit(): void {
        this.loadPersons()
    }

    createPerson(): void {
        // ici on va faire un toggleCreatePerson plutot et ouvrir le drawer
        // la methode de creation sera dans le create
        //qu'il faut créer au meme niveau que person detail
        // et un formulaire complet avec le modele qui va devenir complet
        // apparemment on a acces au modele de l'api depuis le front
    }

    togglePersonDetails(person: Person): void {
        if (this.selectedPerson()?.id === person.id) {
            this.selectedPerson.set(null)
            this.drawerOpened.set(false)
        } else {
            this.selectedPerson.set(person)
            this.drawerOpened.set(true)
        }
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
