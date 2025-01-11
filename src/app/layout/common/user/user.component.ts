import { BooleanInput } from '@angular/cdk/coercion'
import { NgClass } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Input,
    ViewEncapsulation,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { Router, RouterModule } from '@angular/router'
import { FuseUtilsService } from '@fuse/services/utils/utils.service'
import { TranslocoPipe } from '@ngneat/transloco'
import { UserService } from 'app/core/user/services/user.service'

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

    readonly userEmail = computed(() => this._userService.user()?.email ?? '')
    readonly userAvatar = computed(() => this._userService.user()?.avatar ?? '')

    private readonly _router = inject(Router)
    private readonly _userService = inject(UserService)
    private readonly _fuseUtilsService = inject(FuseUtilsService)

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
