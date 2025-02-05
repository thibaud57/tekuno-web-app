import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { getDefaultCountry } from 'app/shared/utils/address.utils'
import { AddressForm } from './address-form.model'

@Injectable({ providedIn: 'root' })
export class AddressFormService {
    createForm(): FormGroup<AddressForm> {
        return new FormGroup<AddressForm>({
            streetNumber: new FormControl(null),
            streetName: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            city: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            postalCode: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            country: new FormControl(getDefaultCountry(), {
                nonNullable: true,
                validators: [Validators.required],
            }),
        })
    }
}
