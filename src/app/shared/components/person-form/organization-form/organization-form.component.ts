import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { OrganizationType } from '@backend/persons/enums/organization-type.enum'
import { TranslocoPipe } from '@ngneat/transloco'
import { SortAlphabeticallyPipe } from 'app/shared/pipes/sort-alphabetically.pipe'
import { OrganizationForm } from '../../../services/person-form/person-form.model'
import { BankDetailsFormComponent } from '../../bank-details-form/bank-details-form.component'

@Component({
    selector: 'app-organization-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatExpansionModule,
        MatIconModule,
        TranslocoPipe,
        SortAlphabeticallyPipe,
        BankDetailsFormComponent,
    ],
    templateUrl: './organization-form.component.html',
    styleUrls: ['./organization-form.component.scss'],
})
export class OrganizationFormComponent {
    @Input({ required: true }) form!: FormGroup<OrganizationForm>

    protected readonly TRANSLATION_PREFIX =
        'shared.person-form.organization-form.'
    readonly organizationTypes = Object.values(OrganizationType)

    enableBankDetailsForm(expanded: boolean): void {
        const bankDetailsForm = this.form.controls.bankDetails
        if (expanded) {
            bankDetailsForm.enable()
        } else {
            bankDetailsForm.reset()
            bankDetailsForm.disable()
        }
    }
}
