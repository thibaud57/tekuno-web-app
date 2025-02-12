import { FormControl } from '@angular/forms'

export interface BankDetailsForm {
    name: FormControl<string | null>
    iban: FormControl<string | null>
    bic: FormControl<string | null>
    paypal: FormControl<string | null>
}
