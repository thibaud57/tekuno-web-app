import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BankDetailsForm } from './bank-details-form.model'

@Injectable({ providedIn: 'root' })
export class BankDetailsFormService {
    createForm(): FormGroup<BankDetailsForm> {
        return new FormGroup<BankDetailsForm>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            iban: new FormControl(null),
            bic: new FormControl(null),
            paypal: new FormControl(null, {
                validators: [Validators.email],
            }),
        })
    }
}
