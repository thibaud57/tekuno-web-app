import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/services/auth.service'
import { TranslationService } from 'app/core/services/translation.service'
import { finalize } from 'rxjs'

@Component({
    selector: 'app-auth-forgot-password',
    templateUrl: './forgot-password.component.html',
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
        MatProgressSpinnerModule,
        RouterLink,
        TranslocoPipe,
    ],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm

    readonly TRANSLATION_PREFIX = 'modules.auth.forgot-password.'

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    }
    showAlert = false
    form: FormGroup

    private readonly authService = inject(AuthService)
    private readonly formBuilder = inject(FormBuilder)
    private readonly translationService = inject(TranslationService)

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        })
    }

    sendResetLink(): void {
        if (this.form.invalid) {
            return
        }

        this.form.disable()
        this.showAlert = false

        this.authService
            .forgotPassword(this.form.controls.email.value)
            .pipe(
                finalize(() => {
                    this.form.enable()
                    this.forgotPasswordNgForm.resetForm()
                    this.showAlert = true
                })
            )
            .subscribe({
                next: () => {
                    this.alert = {
                        type: 'success',
                        message: this.translationService.getTranslation(
                            this.TRANSLATION_PREFIX + 'demande-envoyee'
                        ),
                    }
                },
                error: () => {
                    this.alert = {
                        type: 'error',
                        message:
                            this.translationService.getTranslation(
                                'common.erreur-api'
                            ),
                    }
                },
            })
    }
}
