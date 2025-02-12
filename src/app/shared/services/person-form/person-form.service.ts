import { inject, Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { CorrespondentType } from '@backend/persons/enums/correspodent-type.enum'
import { Gender } from '@backend/persons/enums/gender.enum'
import { OrganizationType } from '@backend/persons/enums/organization-type.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { BankDetails } from '@backend/persons/models/bank-details/bank-details.model'
import {
    Person,
    SIRET_PATTERN,
} from '@backend/persons/models/person/person.model'
import { getDefaultCountry } from 'app/shared/utils/address.utils'
import { cleanPhoneNumber } from 'app/shared/utils/phone.utils'
import { AddressFormService } from '../address-form/address-form.service'
import { BankDetailsFormService } from '../bank-details-form/bank-details-form.service'
import { SocialMediaFormService } from '../social-media-form/social-media-form.service'
import {
    BasePersonForm,
    CorrespondentForm,
    DjForm,
    OrganizationForm,
    PersonForm,
} from './person-form.model'

@Injectable({ providedIn: 'root' })
export class PersonFormService {
    private readonly addressFormService = inject(AddressFormService)
    private readonly socialMediaFormService = inject(SocialMediaFormService)
    private readonly bankDetailsFormService = inject(BankDetailsFormService)

    createPersonForm(type: PersonType): FormGroup {
        switch (type) {
            case PersonType.DJ:
                return this.createDjForm()
            case PersonType.ORGANIZATION:
                return this.createOrganizationForm()
            case PersonType.CORRESPONDENT:
                return this.createCorrespondentForm()
            default:
                throw new Error('Invalid person type')
        }
    }

    getPerson(form: FormGroup<PersonForm>): Person {
        const formValue = form.value

        const phone = cleanPhoneNumber(
            formValue.phone,
            formValue.phonePrefix.phonePrefix
        )

        const addressForm = form.controls.address
        const address = this.addressFormService.getAddress(addressForm)

        const socialMediaForm = form.controls.socialMedia
        const socialMedia =
            this.socialMediaFormService.getSocialMedia(socialMediaForm)

        const bankDetails = this.getBankDetailsFromForm(form)

        return {
            ...formValue,
            phone,
            address,
            socialMedia,
            bankDetails,
        } as Person
    }

    private createBaseForm(personType: PersonType): FormGroup<BasePersonForm> {
        const addressForm = this.addressFormService.createForm()
        addressForm.disable()

        const socialMediaForm = this.socialMediaFormService.createForm()
        socialMediaForm.disable()

        return new FormGroup<BasePersonForm>({
            personType: new FormControl(personType, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(2)],
            }),
            firstName: new FormControl(null, {
                validators:
                    personType === PersonType.ORGANIZATION
                        ? []
                        : [Validators.required],
            }),
            gender: new FormControl<Gender | null>(null, {
                validators:
                    personType === PersonType.ORGANIZATION
                        ? []
                        : [Validators.required],
            }),
            address: addressForm,
            email: new FormControl(null, { validators: [Validators.email] }),
            phonePrefix: new FormControl(getDefaultCountry()),
            phone: new FormControl(null),
            socialMedia: socialMediaForm,
            profilePicture: new FormControl(null),
            description: new FormControl(null),
            equipments: new FormControl([]),
        })
    }

    private createDjForm(): FormGroup<DjForm> {
        const baseForm = this.createBaseForm(PersonType.DJ)

        const bankDetailsForm = this.bankDetailsFormService.createForm()
        bankDetailsForm.disable()

        return new FormGroup<DjForm>({
            ...baseForm.controls,
            alias: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            biography: new FormControl(null),
            logo: new FormControl(null),
            eventIds: new FormControl([]),
            price: new FormControl(0),
            agencyId: new FormControl(null),
            bankDetails: bankDetailsForm,
            siret: new FormControl(null, {
                validators: [Validators.pattern(SIRET_PATTERN)],
            }),
            vat: new FormControl(null),
        })
    }

    private createOrganizationForm(): FormGroup<OrganizationForm> {
        const baseForm = this.createBaseForm(PersonType.ORGANIZATION)

        const bankDetailsForm = this.bankDetailsFormService.createForm()
        bankDetailsForm.disable()

        return new FormGroup<OrganizationForm>({
            ...baseForm.controls,
            organizationType: new FormControl<OrganizationType>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            correspondentIds: new FormControl([]),
            bankDetails: bankDetailsForm,
            siret: new FormControl(null, {
                validators: [Validators.pattern(SIRET_PATTERN)],
            }),
            vat: new FormControl(null),
        })
    }

    private createCorrespondentForm(): FormGroup<CorrespondentForm> {
        const baseForm = this.createBaseForm(PersonType.CORRESPONDENT)

        return new FormGroup<CorrespondentForm>({
            ...baseForm.controls,
            organizationId: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            correspondentType: new FormControl<CorrespondentType>(
                CorrespondentType.EVENT_COORDINATOR,
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            isActive: new FormControl(true),
            isDefault: new FormControl(true),
        })
    }

    private getBankDetailsFromForm(
        form: FormGroup<PersonForm>
    ): BankDetails | undefined {
        const formValue = form.value

        if (
            formValue.personType !== PersonType.DJ &&
            formValue.personType !== PersonType.ORGANIZATION
        ) {
            return undefined
        }

        const formWithBankDetails = form as FormGroup<DjForm | OrganizationForm>
        const bankDetailsForm = formWithBankDetails.controls.bankDetails

        return this.bankDetailsFormService.getBankDetails(bankDetailsForm)
    }
}
