import { NgIf } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { Person } from '@backend/persons/models/person.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { AvatarComponent } from 'app/shared/components/avatar/avatar.component'

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        TranslocoPipe,
        AvatarComponent,
        NgIf,
    ],
})
export class PersonDetailComponent {
    readonly TRANSLATION_PREFIX = 'modules.admin.address-book.person-detail.'

    @Input({ required: true }) person: Person
    @Output() close = new EventEmitter<void>()

    onClose(): void {
        this.close.emit()
    }
}
