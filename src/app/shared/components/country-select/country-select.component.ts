import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@ngneat/transloco'
import { CountriesInfo, CountryInfo } from 'app/shared/models/country-info'
import { getFlag } from '../../utils/address.utils'

@Component({
    selector: 'app-country-select',
    templateUrl: './country-select.component.html',
    styleUrls: ['./country-select.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        CommonModule,
        TranslocoPipe,
    ],
})
export class CountrySelectComponent {
    @Input({ required: true }) control!: FormControl<CountryInfo | null>
    @Input() withPhonePrefix = false

    readonly countries = CountriesInfo

    protected readonly getFlag = getFlag
}
