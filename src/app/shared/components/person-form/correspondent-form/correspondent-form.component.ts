import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CorrespondentType } from '@backend/persons/enums/correspodent-type.enum'
import { PersonType } from '@backend/persons/enums/person-type.enum'
import { PersonFilters } from '@backend/persons/models/person/person-filter.model'
import { Person } from '@backend/persons/models/person/person.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { PersonService } from 'app/modules/admin/services/person/person.service'
import { SortAlphabeticallyPipe } from 'app/shared/pipes/sort-alphabetically.pipe'
import { map, Observable } from 'rxjs'
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
        MatSlideToggleModule,
        TranslocoPipe,
        SortAlphabeticallyPipe,
    ],
    templateUrl: './correspondent-form.component.html',
    styleUrls: ['./correspondent-form.component.scss'],
})
export class CorrespondentFormComponent implements OnInit {
    private readonly personService = inject(PersonService)

    @Input({ required: true }) form!: FormGroup<CorrespondentForm>

    readonly TRANSLATION_PREFIX = 'shared.person-form.correspondent-form.'
    readonly correspondentTypes = Object.values(CorrespondentType)

    organizations$!: Observable<Person[]>

    ngOnInit(): void {
        const filters: PersonFilters = {
            personType: PersonType.ORGANIZATION,
        }
        this.organizations$ = this.personService
            .getPersons(filters)
            .pipe(
                map(persons =>
                    persons.sort((a, b) => a.name.localeCompare(b.name))
                )
            )
    }
}
