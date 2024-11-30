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
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/auth.service'

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
    signInForm: UntypedFormGroup
    showAlert = false

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            email: ['email@tekuno.fr', [Validators.required, Validators.email]],
            password: ['password', Validators.required],
        })
    }

    signIn(): void {
        if (this.signInForm.invalid) {
            return
        }
        this.signInForm.disable()
        this.showAlert = false

        // todo trad du message erreur

        this._authService.signIn(this.signInForm.value).subscribe({
            next: () => {
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect'
                this._router.navigateByUrl(redirectURL)
            },
            error: () => {
                this.signInForm.enable()
                this.signInNgForm.resetForm()
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                }
                this.showAlert = true
            },
        })
    }
}
