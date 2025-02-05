import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@ngneat/transloco'
import { CorrespondentForm } from '../../../services/person-form/person-form.model'

@Component({
    selector: 'app-correspondent-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoPipe,
    ],
    templateUrl: './correspondent-form.component.html',
    styleUrls: ['./correspondent-form.component.scss'],
})
export class CorrespondentFormComponent {
    @Input({ required: true }) form!: FormGroup<CorrespondentForm>

    protected readonly TRANSLATION_PREFIX =
        'shared.person-form.correspondent-form.'
}
