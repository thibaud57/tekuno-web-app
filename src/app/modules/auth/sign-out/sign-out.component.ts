import { I18nPluralPipe } from '@angular/common'
import {
    Component,
    DestroyRef,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router, RouterLink } from '@angular/router'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/services/auth.service'
import { finalize, takeWhile, tap, timer } from 'rxjs'

interface CountdownMapping {
    '=1': string
    other: string
}

@Component({
    selector: 'app-auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, I18nPluralPipe, TranslocoPipe],
})
export class AuthSignOutComponent implements OnInit {
    readonly TRANSLATION_PREFIX = 'modules.auth.sign-out.'

    countdown = 5
    countdownMapping: CountdownMapping = {
        '=1': '# second',
        other: '# seconds',
    }

    private readonly authService = inject(AuthService)
    private readonly router = inject(Router)
    private readonly destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this.authService.signOut()

        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    this.router.navigate(['sign-in'])
                }),
                takeWhile(() => this.countdown > 0),
                takeUntilDestroyed(this.destroyRef),
                tap(() => this.countdown--)
            )
            .subscribe()
    }
}
