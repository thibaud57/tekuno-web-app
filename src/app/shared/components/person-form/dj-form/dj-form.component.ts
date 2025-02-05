import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { TranslocoModule } from '@ngneat/transloco'
import { NgxMaskDirective } from 'ngx-mask'
import { DjForm } from '../../../services/person-form/person-form.model'
import { BankDetailsFormComponent } from '../../bank-details-form/bank-details-form.component'

@Component({
    selector: 'app-dj-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoModule,
        NgxMaskDirective,
        BankDetailsFormComponent,
    ],
    templateUrl: './dj-form.component.html',
    styleUrls: ['./dj-form.component.scss'],
})
export class DjFormComponent {
    @Input({ required: true }) form!: FormGroup<DjForm>

    protected readonly TRANSLATION_PREFIX = 'shared.person-form.dj-form.'
}
