import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { FuseValidators } from '@fuse/validators'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/auth.service'
import { finalize } from 'rxjs'

@Component({
    selector: 'app-auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
        TranslocoPipe,
    ],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm

    readonly TRANSLATION_PREFIX = 'modules.auth.reset-password.'

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    }
    resetPasswordForm: UntypedFormGroup
    showAlert = false

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        )
    }

    resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            return
        }
        this.resetPasswordForm.disable()
        this.showAlert = false

        // todo gerer la trad

        this._authService
            .resetPassword(this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {
                    this.resetPasswordForm.enable()
                    this.resetPasswordNgForm.resetForm()
                    this.showAlert = true
                })
            )
            .subscribe({
                next: () => {
                    this.alert = {
                        type: 'success',
                        message: 'Votre mot de passe a été réinitialisé.',
                    }
                },
                error: () => {
                    this.alert = {
                        type: 'error',
                        message: 'Une erreur est survenue, veuillez réessayer.',
                    }
                },
            })
    }
}
