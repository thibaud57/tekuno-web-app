import { FormControl, FormGroup } from '@angular/forms'
import { CorrespondentType } from '@backend/persons/enums/correspodent-type.enum'
import { Gender } from '@backend/persons/enums/gender.enum'
import { OrganizationType } from '@backend/persons/enums/organization-type.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { CountryInfo } from '../../../shared/models/country-info'
import { AddressForm } from '../address-form/address-form.model'
import { BankDetailsForm } from '../bank-details-form/bank-details-form.model'
import { SocialMediaForm } from '../social-media-form/social-media-form.model'

export interface BasePersonForm {
    personType: FormControl<PersonType>
    name: FormControl<string>
    firstName: FormControl<string | null>
    gender: FormControl<Gender | null>
    address: FormGroup<AddressForm>
    email: FormControl<string | null>
    phonePrefix: FormControl<CountryInfo | null>
    phone: FormControl<string | null>
    socialMedia: FormGroup<SocialMediaForm>
    profilePicture: FormControl<string | null>
    description: FormControl<string | null>
    equipments: FormControl<string[]>
}

export interface DjForm extends BasePersonForm {
    alias: FormControl<string>
    biography: FormControl<string | null>
    logo: FormControl<string | null>
    eventIds: FormControl<string[]>
    price: FormControl<number | null>
    agencyId: FormControl<string | null>
    bankDetails: FormGroup<BankDetailsForm>
    siret: FormControl<number | null>
    vat: FormControl<string | null>
}

export interface OrganizationForm extends BasePersonForm {
    organizationType: FormControl<OrganizationType>
    correspondentIds: FormControl<string[]>
    bankDetails: FormGroup<BankDetailsForm>
    siret: FormControl<number | null>
    vat: FormControl<string | null>
}

export interface CorrespondentForm extends BasePersonForm {
    organizationId: FormControl<string>
    correspondentType: FormControl<CorrespondentType>
    isActive: FormControl<boolean>
    isDefault: FormControl<boolean>
}

export type PersonForm = DjForm | OrganizationForm | CorrespondentForm
