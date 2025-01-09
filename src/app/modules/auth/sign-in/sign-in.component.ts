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
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/services/auth.service'
import { TranslationService } from 'app/core/translation/translation.service'

@Component({
    selector: 'app-auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        TranslocoPipe,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm

    readonly TRANSLATION_PREFIX = 'modules.auth.sign-in.'

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    }
    showAlert = false
    form: FormGroup

    private readonly route = inject(ActivatedRoute)
    private readonly authService = inject(AuthService)
    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly translationService = inject(TranslationService)

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['email@tekuno.fr', [Validators.required, Validators.email]],
            password: ['password', Validators.required],
        })
    }

    signIn(): void {
        if (this.form.invalid) {
            return
        }
        this.form.disable()
        this.showAlert = false

        this.authService.signIn(this.form.value).subscribe({
            next: () => {
                const redirectURL =
                    this.route.snapshot.queryParamMap.get('redirectURL') ||
                    '/signed-in-redirect'
                this.router.navigateByUrl(redirectURL)
            },
            error: () => {
                this.form.enable()
                this.signInNgForm.resetForm()
                this.alert = {
                    type: 'error',
                    message: this.translationService.getTranslation(
                        this.TRANSLATION_PREFIX + 'email-mot-de-passe-invalide'
                    ),
                }
                this.showAlert = true
            },
        })
    }
}
