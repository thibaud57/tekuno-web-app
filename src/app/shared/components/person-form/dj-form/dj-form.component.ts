import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { OrganizationType } from '@backend/persons/enums/organization-type.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { PersonFilters } from '@backend/persons/models/person/person-filter.model'
import { Person } from '@backend/persons/models/person/person.model'
import { TranslocoModule } from '@ngneat/transloco'
import { PersonService } from 'app/modules/admin/services/person/person.service'
import { NgxMaskDirective } from 'ngx-mask'
import { map, Observable } from 'rxjs'
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
        MatExpansionModule,
        MatIconModule,
        TranslocoModule,
        NgxMaskDirective,
        BankDetailsFormComponent,
    ],
    templateUrl: './dj-form.component.html',
    styleUrls: ['./dj-form.component.scss'],
})
export class DjFormComponent implements OnInit {
    private readonly personService = inject(PersonService)

    @Input({ required: true }) form!: FormGroup<DjForm>

    protected readonly TRANSLATION_PREFIX = 'shared.person-form.dj-form.'

    agencies$!: Observable<Person[]>

    ngOnInit(): void {
        const filters: PersonFilters = {
            personType: PersonType.ORGANIZATION,
            organizationType: OrganizationType.AGENCY,
        }
        this.agencies$ = this.personService
            .getPersons(filters)
            .pipe(
                map(persons =>
                    persons.sort((a, b) => a.name.localeCompare(b.name))
                )
            )
    }

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
