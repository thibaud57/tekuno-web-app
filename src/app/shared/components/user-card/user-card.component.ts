import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@ngneat/transloco'
import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { User } from 'app/core/user/models/user.model'
import { AvatarComponent } from '../avatar/avatar.component'

@Component({
    selector: 'app-user-card',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        TranslocoPipe,
        AvatarComponent,
        CommonModule,
    ],
    templateUrl: './user-card.component.html',
})
export class UserCardComponent implements OnInit {
    @Input({ required: true }) user!: User
    @Input() showDeleteButton = true

    @Output() roleChange = new EventEmitter<User>()
    @Output() delete = new EventEmitter<User>()

    readonly TRANSLATION_PREFIX = 'modules.admin.user-settings.'
    readonly roles = Object.values(TypeRole)
    readonly TypeRole = TypeRole

    form: FormGroup

    private readonly formBuilder = inject(FormBuilder)

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            roles: [this.user.roles],
        })

        this.form.controls.roles.valueChanges.subscribe(roles => {
            const updatedUser = {
                ...this.user,
                roles,
            }
            this.roleChange.emit(updatedUser)
        })
    }
}
