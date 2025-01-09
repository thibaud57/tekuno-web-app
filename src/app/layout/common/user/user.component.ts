import { BooleanInput } from '@angular/cdk/coercion'
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { Router } from '@angular/router'
import { TranslocoPipe } from '@ngneat/transloco'
import { UserService } from 'app/core/user/services/user.service'
import { User } from 'app/core/user/user.types'

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        TranslocoPipe,
    ],
})
export class UserComponent implements OnInit {
    static ngAcceptInputType_showAvatar: BooleanInput

    @Input() showAvatar = true

    readonly TRANSLATION_PREFIX = 'layout.common.user.'

    user: User

    private _changeDetectorRef = inject(ChangeDetectorRef)
    private _router = inject(Router)
    private _userService = inject(UserService)
    private _destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((user: User) => {
                this.user = user
                this._changeDetectorRef.markForCheck()
            })
    }

    signOut(): void {
        this._router.navigate(['/sign-out'])
    }
}
