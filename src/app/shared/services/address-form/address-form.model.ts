import { FormControl } from '@angular/forms'
import { CountryInfo } from 'app/shared/models/country-info'

export interface AddressForm {
    streetNumber: FormControl<string | null>
    streetName: FormControl<string>
    city: FormControl<string>
    postalCode: FormControl<string>
    country: FormControl<CountryInfo>
}
