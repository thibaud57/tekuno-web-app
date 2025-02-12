import { FormControl } from '@angular/forms'
import { CountryInfo } from 'app/shared/models/country-info'

export interface AddressForm {
    streetNumber: FormControl<string | null>
    streetName: FormControl<string | null>
    city: FormControl<string | null>
    postalCode: FormControl<string | null>
    country: FormControl<CountryInfo | null>
}
