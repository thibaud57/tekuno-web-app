import { I18nPluralPipe } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { TranslocoPipe } from '@ngneat/transloco'
import { AuthService } from 'app/core/auth/auth.service'
import {
    Subject,
    Subscription,
    finalize,
    takeUntil,
    takeWhile,
    tap,
    timer,
} from 'rxjs'

@Component({
    selector: 'app-auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, I18nPluralPipe, TranslocoPipe],
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
    readonly TRANSLATION_PREFIX = 'modules.auth.sign-out.'

    countdown = 5
    countdownMapping: any = {
        '=1': '# second',
        other: '# seconds',
    }

    private _unsubscribeAll: Subject<Subscription> = new Subject<Subscription>()

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._authService.signOut()

        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    this._router.navigate(['sign-in'])
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe()
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null)
        this._unsubscribeAll.complete()
    }
}
