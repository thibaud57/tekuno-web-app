import { NgIf } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TranslocoModule } from '@ngneat/transloco'
import { AvatarComponent } from 'app/shared/components/avatar/avatar.component'
import { Person } from 'app/shared/models/person.model'

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
        AvatarComponent,
        NgIf,
    ],
})
export class PersonDetailComponent {
    readonly TRANSLATION_PREFIX = 'modules.admin.address-book.'

    @Input({ required: true }) person!: Person
    @Output() close = new EventEmitter<void>()

    onClose(): void {
        this.close.emit()
    }
}
