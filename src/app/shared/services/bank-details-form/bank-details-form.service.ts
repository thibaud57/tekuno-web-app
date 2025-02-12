import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BankDetails } from '@backend/persons/models/bank-details/bank-details.model'
import { BankDetailsForm } from './bank-details-form.model'

@Injectable({ providedIn: 'root' })
export class BankDetailsFormService {
    createForm(): FormGroup<BankDetailsForm> {
        return new FormGroup<BankDetailsForm>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(2)],
            }),
            iban: new FormControl(null),
            bic: new FormControl(null),
            paypal: new FormControl(null, {
                validators: [Validators.email],
            }),
        })
    }

    getBankDetails(form: FormGroup<BankDetailsForm>): BankDetails | undefined {
        const formValue = form.value

        if (
            !formValue.name ||
            (!formValue.iban && !formValue.bic && !formValue.paypal)
        ) {
            return undefined
        }

        return {
            name: formValue.name,
            iban: formValue.iban,
            bic: formValue.bic,
            paypal: formValue.paypal,
        }
    }
}
