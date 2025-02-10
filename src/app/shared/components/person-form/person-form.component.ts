import { CommonModule } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { Gender } from '@backend/persons/enums/gender.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { Person } from '@backend/persons/models/person.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { NotificationService } from 'app/core/services/notification.service'
import { AddressFormComponent } from 'app/shared/components/address-form/address-form.component'
import { CountrySelectComponent } from 'app/shared/components/country-select/country-select.component'
import { SocialMediaFormType } from 'app/shared/enums/social-media-form-type.enum'
import { PersonForm } from 'app/shared/services/person-form/person-form.model'
import { PersonFormService } from 'app/shared/services/person-form/person-form.service'
import { cleanPhoneNumber } from 'app/shared/utils/phone.utils'
import { PersonService } from '../../../modules/admin/services/person/person.service'
import { SortAlphabeticallyPipe } from '../../pipes/sort-alphabetically.pipe'
import { SocialMediaFormComponent } from '../social-media-form/social-media-form.component'
import { CorrespondentFormComponent } from './correspondent-form/correspondent-form.component'
import { DjFormComponent } from './dj-form/dj-form.component'
import { OrganizationFormComponent } from './organization-form/organization-form.component'

@Component({
    selector: 'app-person-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        TranslocoPipe,
        AddressFormComponent,
        CountrySelectComponent,
        DjFormComponent,
        OrganizationFormComponent,
        CorrespondentFormComponent,
        SortAlphabeticallyPipe,
        SocialMediaFormComponent,
    ],
    templateUrl: './person-form.component.html',
    styleUrl: './person-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonFormComponent {
    private readonly personFormService = inject(PersonFormService)
    private readonly personService = inject(PersonService)
    private readonly notificationService = inject(NotificationService)

    @Output() closeDrawer = new EventEmitter<void>()

    readonly TRANSLATION_PREFIX = 'shared.person-form.'
    readonly personTypes = Object.values(PersonType).filter(
        type => type !== PersonType.CUSTOMER && type !== PersonType.MEMBER
    )

    form = signal<FormGroup<PersonForm>>(
        this.personFormService.createPersonForm(PersonType.ORGANIZATION)
    )
    isOrganization = computed(
        () => this.form().controls.personType.value === PersonType.ORGANIZATION
    )
    personTypeForm = computed(() =>
        this.form().controls.personType.value === PersonType.DJ
            ? SocialMediaFormType.DJ
            : SocialMediaFormType.NORMAL
    )

    protected readonly PersonType = PersonType
    protected readonly Gender = Gender

    constructor() {
        effect(() => {
            const form = this.form()

            form.controls.personType.valueChanges.subscribe(type => {
                if (type) {
                    const newForm =
                        this.personFormService.createPersonForm(type)
                    this.form.set(newForm)
                }
            })
        })
    }

    onSubmit(): void {
        const currentForm = this.form()
        const formValue = currentForm.value

        // Nettoyer le numéro de téléphone avant l'envoi
        if (formValue.phone && formValue.phonePrefix?.phonePrefix) {
            formValue.phone = cleanPhoneNumber(
                formValue.phone,
                formValue.phonePrefix.phonePrefix
            )
        }

        // Créer une copie sans phonePrefix
        const { phonePrefix, ...formWithoutPrefix } = formValue

        const person = {
            ...formWithoutPrefix,
            address: formValue.address
                ? {
                      ...formValue.address,
                      country: formValue.address.country?.name,
                  }
                : null,
        } as unknown as Omit<Person, 'id' | 'phonePrefix'>

        this.personService.createPerson(person).subscribe({
            next: () => {
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'success.create'
                )
                this.closeDrawer.emit()
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX + 'error.create',
                    error.error.message
                )
            },
        })
    }

    onClose(): void {
        this.closeDrawer.emit()
    }
}
