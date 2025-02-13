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
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { Gender } from '@backend/persons/enums/gender.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { TranslocoPipe } from '@ngneat/transloco'
import { NotificationService } from 'app/core/services/notification.service'
import { AddressFormComponent } from 'app/shared/components/address-form/address-form.component'
import { CountrySelectComponent } from 'app/shared/components/country-select/country-select.component'
import { SocialMediaFormType } from 'app/shared/enums/social-media-form-type.enum'
import { PersonForm } from 'app/shared/services/person-form/person-form.model'
import { PersonFormService } from 'app/shared/services/person-form/person-form.service'
import { getAvatarFileName } from 'app/shared/utils/file.utils'
import { PersonService } from '../../../modules/admin/services/person/person.service'
import { SortAlphabeticallyPipe } from '../../pipes/sort-alphabetically.pipe'
import { UploadService } from '../../services/upload/upload.service'
import { AvatarComponent } from '../avatar/avatar.component'
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
        MatExpansionModule,
        TranslocoPipe,
        AddressFormComponent,
        CountrySelectComponent,
        DjFormComponent,
        OrganizationFormComponent,
        CorrespondentFormComponent,
        SortAlphabeticallyPipe,
        SocialMediaFormComponent,
        AvatarComponent,
    ],
    templateUrl: './person-form.component.html',
    styleUrl: './person-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonFormComponent {
    private readonly personFormService = inject(PersonFormService)
    private readonly personService = inject(PersonService)
    private readonly notificationService = inject(NotificationService)
    private readonly uploadService = inject(UploadService)

    @Output() closeDrawer = new EventEmitter<void>()

    readonly TRANSLATION_PREFIX = 'shared.person-form.'
    readonly selectablePersonTypes = Object.values(PersonType).filter(
        type => type !== PersonType.CUSTOMER && type !== PersonType.MEMBER
    )

    form = signal<FormGroup<PersonForm>>(
        this.personFormService.createPersonForm(PersonType.ORGANIZATION)
    )
    isOrganization = computed(
        () => this.form().controls.personType.value === PersonType.ORGANIZATION
    )
    typeSocialMediaForm = computed(() =>
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

    enableAddressForm(expanded: boolean): void {
        const addressForm = this.form().controls.address
        if (expanded) {
            addressForm.enable()
        } else {
            addressForm.reset()
            addressForm.disable()
        }
    }

    enableSocialMediaForm(expanded: boolean): void {
        const socialMediaForm = this.form().controls.socialMedia
        if (expanded) {
            socialMediaForm.enable()
        } else {
            socialMediaForm.reset()
            socialMediaForm.disable()
        }
    }

    onSubmit(): void {
        if (this.form().invalid) {
            this.notificationService.showError('common.errors.invalid-form')
            return
        }

        const currentForm = this.form()
        const person = this.personFormService.buildPerson(currentForm)

        this.personService.createPerson(person).subscribe({
            next: () => {
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'alertes.contact-ajoute'
                )
                this.closeDrawer.emit()
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX + 'alertes.erreur-creation-contact',
                    error.error.message
                )
            },
        })
    }

    onClose(): void {
        this.closeDrawer.emit()
    }

    onAvatarUpload(file: File): void {
        const path = getAvatarFileName(file.name)
        const form = this.form()

        this.uploadService.uploadPicture(file, path).subscribe({
            next: url => {
                form.patchValue({ profilePicture: url })
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'alertes.avatar-upload-succes'
                )
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX + 'alertes.avatar-upload-erreur',
                    error.error?.message
                )
            },
        })
    }

    onAvatarDelete(): void {
        const form = this.form()
        form.patchValue({ profilePicture: null })
    }
}
