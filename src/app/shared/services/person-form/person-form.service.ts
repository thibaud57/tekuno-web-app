import { inject, Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { CorrespondentType } from '@backend/persons/enums/correspodent-type.enum'
import { Gender } from '@backend/persons/enums/gender.enum'
import { OrganizationType } from '@backend/persons/enums/organization-type.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { getDefaultCountry } from 'app/shared/utils/address.utils'
import { AddressFormService } from '../address-form/address-form.service'
import { BankDetailsFormService } from '../bank-details-form/bank-details-form.service'
import {
    BasePersonForm,
    CorrespondentForm,
    DjForm,
    OrganizationForm,
} from './person-form.model'

@Injectable({ providedIn: 'root' })
export class PersonFormService {
    private readonly addressFormService = inject(AddressFormService)
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

    createDjForm(): FormGroup<DjForm> {
        const baseForm = this.createBaseForm(PersonType.DJ)
        return new FormGroup<DjForm>({
            ...baseForm.controls,
            socialMedia: new FormControl(null),
            alias: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            biography: new FormControl(null),
            logo: new FormControl(null),
            eventIds: new FormControl([]),
            price: new FormControl(0),
            agencyId: new FormControl(null),
            bankDetails: this.bankDetailsFormService.createForm(),
            siret: new FormControl(null),
            vat: new FormControl(null),
        })
    }

    createOrganizationForm(): FormGroup<OrganizationForm> {
        const baseForm = this.createBaseForm(PersonType.ORGANIZATION)
        return new FormGroup<OrganizationForm>({
            ...baseForm.controls,
            organizationType: new FormControl<OrganizationType>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            correspondentIds: new FormControl([]),
            bankDetails: this.bankDetailsFormService.createForm(),
            siret: new FormControl(null),
            vat: new FormControl(null),
        })
    }

    createCorrespondentForm(): FormGroup<CorrespondentForm> {
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

    private createBaseForm(type: PersonType): FormGroup<BasePersonForm> {
        return new FormGroup<BasePersonForm>({
            personType: new FormControl(type, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(2)],
            }),
            firstName: new FormControl(null),
            gender: new FormControl<Gender | null>(null),
            address: this.addressFormService.createForm(),
            email: new FormControl(null, { validators: [Validators.email] }),
            phonePrefix: new FormControl(getDefaultCountry()),
            phone: new FormControl(null),
            socialMedia: new FormControl(null),
            profilePicture: new FormControl(null),
            description: new FormControl(null),
            equipments: new FormControl([]),
        })
    }
}
