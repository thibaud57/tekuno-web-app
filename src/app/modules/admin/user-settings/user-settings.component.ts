import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { RoleType } from '@backend/auth/enums/role-type.enum'
import { User } from '@backend/users/models/user.model'
import { TranslocoPipe } from '@ngneat/transloco'
import { NotificationService } from 'app/core/services/notification.service'
import { UserService } from 'app/core/user/services/user.service'
import { UserCardComponent } from 'app/shared/components/user-card/user-card.component'
import { SortByRolePipe } from 'app/shared/pipes/sort-by-role.pipe'

@Component({
    selector: 'app-user-settings',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoPipe,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        UserCardComponent,
        SortByRolePipe,
    ],
    templateUrl: './user-settings.component.html',
    styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent implements OnInit {
    readonly TRANSLATION_PREFIX = 'modules.admin.user-settings.'
    readonly roles = Object.values(RoleType)

    form: FormGroup
    users = signal<User[]>([])

    protected readonly RoleType = RoleType

    private readonly formBuilder = inject(FormBuilder)
    private readonly userService = inject(UserService)
    private readonly notificationService = inject(NotificationService)

    ngOnInit(): void {
        if (this.hasRole(RoleType.ADMIN)) {
            this.form = this.formBuilder.nonNullable.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required],
                roles: [[RoleType.MEMBER], Validators.required],
            })
            this.loadUsers()
        }
    }

    hasRole(role: RoleType): boolean {
        return this.userService.hasRole(role)
    }

    addTeamMember(): void {
        this.userService.createUser(this.form.value).subscribe({
            next: () => {
                this.loadUsers()
                this.form.reset()
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'alertes.membre-ajoute'
                )
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX + 'alertes.erreur-ajout-membre',
                    error.error.message
                )
            },
        })
    }

    deleteUser(user: User): void {
        this.userService.deleteUser(user.id).subscribe({
            next: () => {
                this.loadUsers()
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'alertes.utilisateur-supprime'
                )
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX +
                        'alertes.erreur-suppression-utilisateur',
                    error.error.message
                )
            },
        })
    }

    updateUserRole(user: User): void {
        this.userService.updateUser(user).subscribe({
            next: () => {
                this.loadUsers()
                this.notificationService.showSuccess(
                    this.TRANSLATION_PREFIX + 'alertes.role-modifie'
                )
            },
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX +
                        'alertes.erreur-modification-role',
                    error.error.message
                )
            },
        })
    }

    private loadUsers(): void {
        this.userService.getUsers().subscribe({
            next: users => this.users.set(users),
            error: error => {
                this.notificationService.showError(
                    this.TRANSLATION_PREFIX +
                        'alertes.erreur-chargement-utilisateurs',
                    error.error.message
                )
            },
        })
    }
}
