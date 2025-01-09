import { BooleanInput } from '@angular/cdk/coercion'
import { NgClass } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    Input,
    signal,
    ViewEncapsulation,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { Router, RouterModule } from '@angular/router'
import { FuseUtilsService } from '@fuse/services/utils/utils.service'
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
        RouterModule,
        NgClass,
    ],
})
export class UserComponent {
    static ngAcceptInputType_showAvatar: BooleanInput

    @Input() showAvatar = true
    readonly TRANSLATION_PREFIX = 'layout.common.user.'

    private readonly _router = inject(Router)
    private readonly _userService = inject(UserService)
    private readonly _destroyRef = inject(DestroyRef)
    private readonly _fuseUtilsService = inject(FuseUtilsService)

    readonly user = signal<User | null>(null)
    readonly userEmail = computed(() => this.user()?.email ?? '')
    readonly hasAvatar = computed(() => !!this.user()?.avatar)

    constructor() {
        this._userService.user$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(user => {
                this.user.set(user)
            })
    }

    isRouteActive(route: string): boolean {
        return this._router.isActive(
            route,
            this._fuseUtilsService.exactMatchOptions
        )
    }

    navigateToProfile(): void {
        this._router.navigate(['/user-profile'])
    }

    navigateToSettings(): void {
        this._router.navigate(['/user-settings'])
    }

    signOut(): void {
        this._router.navigate(['/sign-out'])
    }
}
