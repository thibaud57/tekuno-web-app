import {
    Component,
    DestroyRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
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
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { FuseValidators } from '@fuse/validators'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/services/auth.service'
import { TranslationService } from 'app/core/services/translation.service'
import { finalize, timer } from 'rxjs'
import { passwordValidator } from '../validators/password-validator.directive'

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
    showAlert = false
    form: FormGroup
    oobCode?: string

    private readonly authService = inject(AuthService)
    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly route = inject(ActivatedRoute)
    private readonly translationService = inject(TranslationService)
    private readonly destroyRef = inject(DestroyRef)

    constructor() {
        this.route.queryParamMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                this.oobCode = params.get('oobCode')
            })
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
            {
                password: ['', [Validators.required, passwordValidator]],
                passwordConfirm: ['', [Validators.required]],
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
        if (this.form.invalid || !this.oobCode) {
            return
        }
        this.form.disable()
        this.showAlert = false

        this.authService
            .resetPassword(this.oobCode, this.form.controls.password.value)
            .pipe(
                finalize(() => {
                    this.form.enable()
                    this.resetPasswordNgForm.resetForm()
                    this.showAlert = true
                    if (this.alert.type === 'success') {
                        timer(1000).subscribe(() => {
                            this.router.navigate(['/sign-in'])
                        })
                    }
                })
            )
            .subscribe({
                next: () => {
                    this.alert = {
                        type: 'success',
                        message: this.translationService.getTranslation(
                            this.TRANSLATION_PREFIX +
                                'mot-de-passe-reinitialise'
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
