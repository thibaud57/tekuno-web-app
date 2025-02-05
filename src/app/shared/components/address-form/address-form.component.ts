import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@ngneat/transloco'
import { AddressForm } from 'app/shared/services/address-form/address-form.model'
import { CountrySelectComponent } from '../country-select/country-select.component'

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoPipe,
        CountrySelectComponent,
    ],
})
export class AddressFormComponent implements OnInit {
    readonly TRANSLATION_PREFIX = 'shared.address-form.'

    @Input({ required: true }) form!: FormGroup<AddressForm>

    ngOnInit(): void {
        console.log('iiziz')
    }
}
