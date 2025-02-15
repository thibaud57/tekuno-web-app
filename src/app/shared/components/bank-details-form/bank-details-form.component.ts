import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TranslocoPipe } from '@ngneat/transloco'
import { BankDetailsForm } from '../../services/bank-details-form/bank-details-form.model'

@Component({
    selector: 'app-bank-details-form',
    templateUrl: './bank-details-form.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TranslocoPipe,
    ],
})
export class BankDetailsFormComponent {
    @Input({ required: true }) form!: FormGroup<BankDetailsForm>

    protected readonly TRANSLATION_PREFIX = 'shared.bank-details-form.'
}
